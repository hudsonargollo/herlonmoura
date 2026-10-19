#!/usr/bin/env python3
"""
Daily Blog Post Generator Cron Job
===================================
Fires daily to generate blog articles via the CRM Pages Function.
Posts are created as 'draft' status for human review/approval.

This script calls the Pages Function /api/blog/generate which proxies to the Worker's AI binding.
Generated posts appear in the admin panel's approval queue (/admin/blog with status filter 'draft').

Environment:
  - CRM_API_URL: base URL for the Pages Function (e.g. https://herlonmoura.clubemkt.digital)
  - ADMIN_API_TOKEN: JWT token for auth (must be admin/editor role)
"""

import json
import os
import sys
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

def main():
    api_url = os.environ.get("WORKER_URL", "https://herlon-moura-crm.hudsonargollo2.workers.dev")
    token = os.environ.get("ADMIN_API_TOKEN", "")

    if not token:
        print("ERROR: ADMIN_API_TOKEN is required for cron blog generation. Please set it in the crontab or environment.")
        sys.exit(2)

    # Topics are from the vascular health content plan
    topics = [
        "sintomas de trombose venosa profunda",
        "diferenca entre varizes e veias spider",
        "como prevenir doencas vasculares",
        "quando procurar um angiologista",
        "tratamento de varizes com espuma",
        "riscos da trombose durante a viagem",
        "como identificar linfedema precocemente",
        "cirurgia ambulatorial de varizes",
    ]

    # Pick today's topic (rotate through the list)
    today = datetime.now()
    topic_index = today.timetuple().tm_yday % len(topics)
    selected_topic = topics[topic_index]

    payload = {
        "topics": [selected_topic],
        "count": 1,
        "category": "Varizes" if "variz" in selected_topic.lower() else "Trombose",
        "generated": True,
    }

    print(f"[{today.isoformat()}] Cron: Generating blog post for topic: {selected_topic}")

    # Call the Worker's AI generation endpoint directly (has AI binding)
    generate_url = f"{api_url}/api/blog/generate"

    try:
        req = Request(
            generate_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
                "User-Agent": "Mozilla/5.0 (compatible; HerlonMoura-DailyBlogBot/1.0)",
            },
            method="POST",
        )
        with urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print(f"[{today.isoformat()}] Cron: Generation result: {json.dumps(result, ensure_ascii=False)}")

            if result.get("posts") or result.get("success"):
                posts = result.get("posts", result.get("articles", []))
                for post in posts:
                    print(f"  -> Draft created: slug={post.get('slug')}, title={post.get('title')}")
                print(f"[{today.isoformat()}] Cron: {len(posts)} post(s) created as draft. Awaiting approval in admin panel.")
            else:
                print(f"[{today.isoformat()}] Cron: No posts generated. Response: {result}")

    except HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else ""
        print(f"[{today.isoformat()}] Cron ERROR: HTTP {e.code} — {body}")
        sys.exit(1)
    except URLError as e:
        print(f"[{today.isoformat()}] Cron ERROR: {e.reason}")
        sys.exit(1)
    except Exception as e:
        print(f"[{today.isoformat()}] Cron ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
