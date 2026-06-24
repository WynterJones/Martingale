#!/usr/bin/env python3
"""fal.py - generate high-fidelity stills and looping video via the fal.ai API.

Reads FAL_KEY from the environment or the repo-root .env (gitignored).

Commands
--------
image  --prompt "..." [--model fal-ai/flux-pro/v1.1-ultra] [--aspect 16:9]
       [--negative "..."] [--seed N] --out path.jpg
    Text-to-image. Default model is FLUX1.1 [pro] ultra (premium stills).

video  --image path_or_url --prompt "..."
       [--model fal-ai/kling-video/v2.5-turbo/pro/image-to-video]
       [--duration 5] [--aspect 16:9] --out path.mp4
    Image-to-video looping motion. Input image is uploaded as a data URI.

bg     IN OUT [--model fal-ai/bria/background/remove]
    Remove background -> clean transparent PNG (best matting; cheap vs remove.bg).
    Accepts positional IN OUT or --image/--out. Alternatives: fal-ai/birefnet/v2
    (cheaper), fal-ai/imageutils/rembg.

Examples
--------
    python3 tools/fal.py image --prompt "cinematic trophy bass leaping at dawn" \
        --aspect 16:9 --out raw/hero.jpg
    python3 tools/fal.py video --image raw/hero.jpg \
        --prompt "subtle water shimmer, drifting mist, gentle parallax, seamless loop" \
        --duration 5 --out assets/video/hero.mp4

Model menu (override with --model)
----------------------------------
    images: fal-ai/flux-pro/v1.1-ultra   (default, premium)
            fal-ai/flux-pro/v1.1
            fal-ai/recraft-v3            (vector/illustration/logo, supports styles)
            fal-ai/ideogram/v2           (best in-image text)
    video : fal-ai/kling-video/v2.5-turbo/pro/image-to-video  (default)
            fal-ai/kling-video/v1.6/standard/image-to-video   (cheaper)
            fal-ai/ltx-video-13b-distilled/image-to-video
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request

QUEUE = "https://queue.fal.run/"


def load_key():
    k = os.environ.get("FAL_KEY")
    if k:
        return k.strip()
    here = os.path.dirname(os.path.abspath(__file__))
    for p in (os.path.join(here, "..", ".env"), ".env"):
        if os.path.exists(p):
            for line in open(p):
                line = line.strip()
                if line.startswith("FAL_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("FAL_KEY not found in env or .env")


def _req(url, key, method="GET", body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("Authorization", f"Key {key}")
    r.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(r, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit(f"fal HTTP {e.code}: {e.read().decode()[:600]}")


def submit(model, payload, key, timeout=900, poll=4):
    sub = _req(QUEUE + model, key, "POST", payload)
    status_url = sub.get("status_url")
    response_url = sub.get("response_url")
    if not status_url:  # some models answer synchronously
        return sub
    t0 = time.time()
    last = None
    while True:
        st = _req(status_url, key)
        s = st.get("status")
        if s != last:
            print(f"  fal status: {s}")
            last = s
        if s == "COMPLETED":
            return _req(response_url, key)
        if s in ("FAILED", "ERROR"):
            sys.exit(f"fal failed: {json.dumps(st)[:600]}")
        if time.time() - t0 > timeout:
            sys.exit("fal timeout")
        time.sleep(poll)


def download(url, out):
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with urllib.request.urlopen(url, timeout=300) as r, open(out, "wb") as f:
        f.write(r.read())
    print(f"saved -> {out} ({os.path.getsize(out)} bytes)")


def data_uri(path):
    if path.startswith(("http://", "https://", "data:")):
        return path
    mime = mimetypes.guess_type(path)[0] or "image/jpeg"
    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()


def cmd_image(a):
    key = load_key()
    payload = {"prompt": a.prompt, "num_images": 1, "aspect_ratio": a.aspect}
    if "flux" in a.model:  # flux-only params; other models reject them
        payload["output_format"] = a.format
        payload["enable_safety_checker"] = False
    if "recraft" in a.model:  # recraft uses image_size (+ optional style), not aspect_ratio
        payload.pop("aspect_ratio", None)
        if a.imgsize:
            w, h = a.imgsize.lower().split("x")
            payload["image_size"] = {"width": int(w), "height": int(h)}
        if a.style:
            payload["style"] = a.style
    if a.negative:
        payload["negative_prompt"] = a.negative
    if a.seed is not None:
        payload["seed"] = a.seed
    res = submit(a.model, payload, key)
    imgs = res.get("images") or res.get("image")
    url = imgs[0]["url"] if isinstance(imgs, list) else imgs["url"]
    download(url, a.out)


def cmd_bg(a):
    """Remove background -> clean transparent PNG via a fal matting model."""
    key = load_key()
    image = a.image or a.image_pos
    out = a.out or a.out_pos
    if not image or not out:
        sys.exit("bg: need input + output, e.g. fal.py bg raw/x.jpg assets/img/x.png")
    payload = {"image_url": data_uri(image)}
    res = submit(a.model, payload, key)
    img = res.get("image") or res.get("images")
    url = (img[0]["url"] if isinstance(img, list) else img["url"]) if img else None
    if not url:
        sys.exit("bg: no image in response: " + json.dumps(res)[:400])
    download(url, out)


def cmd_video(a):
    key = load_key()
    payload = {"prompt": a.prompt, "image_url": data_uri(a.image),
               "duration": str(a.duration)}
    if a.aspect:
        payload["aspect_ratio"] = a.aspect
    print(f"  submitting video ({a.model}) — this can take 1-5 min")
    res = submit(a.model, payload, key)
    vid = res.get("video") or res.get("videos")
    url = vid[0]["url"] if isinstance(vid, list) else vid["url"]
    download(url, a.out)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    i = sub.add_parser("image")
    i.add_argument("--prompt", required=True)
    i.add_argument("--model", default="fal-ai/flux-pro/v1.1-ultra")
    i.add_argument("--aspect", default="16:9")
    i.add_argument("--negative", default="")
    i.add_argument("--seed", type=int, default=None)
    i.add_argument("--format", default="jpeg", choices=["jpeg", "png"])
    i.add_argument("--imgsize", default="", help="recraft only: WIDTHxHEIGHT, e.g. 1600x540")
    i.add_argument("--style", default="", help="recraft only: e.g. realistic_image, digital_illustration")
    i.add_argument("--out", required=True)
    i.set_defaults(func=cmd_image)

    b = sub.add_parser("bg", help="remove background -> transparent PNG (fal matting)")
    b.add_argument("image_pos", nargs="?", help="input image (positional)")
    b.add_argument("out_pos", nargs="?", help="output PNG (positional)")
    b.add_argument("--image", help="input image (alternative to positional)")
    b.add_argument("--model", default="fal-ai/bria/background/remove",
                   help="matting: fal-ai/bria/background/remove (default, best edges) | "
                        "fal-ai/birefnet/v2 (cheaper) | fal-ai/imageutils/rembg")
    b.add_argument("--out", help="output PNG (alternative to positional)")
    b.set_defaults(func=cmd_bg)

    v = sub.add_parser("video")
    v.add_argument("--image", required=True)
    v.add_argument("--prompt", required=True)
    v.add_argument("--model", default="fal-ai/kling-video/v2.5-turbo/pro/image-to-video")
    v.add_argument("--duration", default=5)
    v.add_argument("--aspect", default="")
    v.add_argument("--out", required=True)
    v.set_defaults(func=cmd_video)

    a = p.parse_args()
    a.func(a)


if __name__ == "__main__":
    main()
