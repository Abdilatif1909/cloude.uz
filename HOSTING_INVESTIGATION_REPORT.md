# Hosting Investigation Report

## Summary

`https://cloude.uz/` is not reaching the Ahost cPanel Passenger application.

The public domain is still pointed at GitHub Pages, so GitHub/Fastly is serving the old static website before any request can reach Ahost Apache or Passenger.

This is a server-side DNS/origin routing issue, not a browser cache issue and not a Django URL routing issue.

## Evidence From Live Domain

Request:

```text
https://cloude.uz/
```

Response headers:

```text
Status: 200 OK
Server: GitHub.com
Via: 1.1 varnish
X-Served-By: cache-fra-eddf8230088-FRA
X-GitHub-Request-Id: present
Content-Length: 705
```

Served HTML signature:

```html
<title>WebDasturlashEdu | cloude.uz uchun zamonaviy frontend</title>
<script type="module" crossorigin src="/assets/index-Y3D5dOIp.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-C97-pYtw.css">
```

That is the old static GitHub Pages site, not the current Django/React build.

## DNS Findings

Current apex DNS records:

```text
cloude.uz A 185.199.108.153
cloude.uz A 185.199.109.153
cloude.uz A 185.199.110.153
cloude.uz A 185.199.111.153
```

These are GitHub Pages IP addresses.

Current `www` DNS:

```text
www.cloude.uz CNAME Abdilatif1909.github.io
```

That also points to GitHub Pages.

## Passenger Usage Verification

The live public domain is not using Passenger right now.

Reason:

- Ahost Passenger can only serve traffic that reaches the Ahost server.
- Public DNS currently sends `cloude.uz` and `www.cloude.uz` to GitHub Pages.
- GitHub returns the HTML directly with `Server: GitHub.com`.
- Therefore Ahost Apache VirtualHost, cPanel Passenger, and `/home/cloudeu2/lms/passenger_wsgi.py` are bypassed for public traffic.

## Apache / DocumentRoot Finding

From the public internet, Apache on Ahost is not currently involved for `cloude.uz`.

The visible origin is GitHub Pages. Any Ahost Apache `DocumentRoot`, static `index.html`, or Passenger configuration cannot affect `https://cloude.uz/` until DNS points to Ahost.

After DNS is corrected, if an old site still appears, then check these cPanel items:

- Domains -> `cloude.uz` document root
- Setup Python App -> Application URL must be `cloude.uz` or the intended subdomain/path
- Setup Python App -> Application root must be `/home/cloudeu2/lms`
- Public web root must not contain an overriding `index.html` for the same domain
- Any `.htaccess` rewrite must not route around Passenger

## Django SPA Verification

Local Django routing is correct.

Relevant `backend/config/urls.py` routing:

```python
path("health/", HealthView.as_view(), name="health")
path("admin/", admin.site.urls)
path("api/v1/", include("api.urls"))
path("", TemplateView.as_view(template_name="frontend/index.html"), name="frontend")
path("<path:path>", TemplateView.as_view(template_name="frontend/index.html"), name="frontend-spa")
```

This means:

- `/health/` should return Django JSON.
- `/api/v1/...` should use the API.
- `/admin/` should use Django admin.
- `/` and frontend SPA routes should render `backend/templates/frontend/index.html`.

Local verification:

```text
/        200 text/html; charset=utf-8
/health/ 200 application/json {"status":"ok"}
```

The local root page renders:

```html
<title>Cloud Education Platform | cloude.uz</title>
<script type="module" crossorigin src="/static/frontend/assets/index-CkPxsyms.js"></script>
<link rel="stylesheet" crossorigin href="/static/frontend/assets/index-g05YduQJ.css">
```

So the generated React SPA in `backend/templates/frontend` and `backend/static/frontend` is correctly wired for Django/Passenger.

## Required Hosting Configuration

Fix DNS at the domain registrar or DNS provider:

1. Remove GitHub Pages apex A records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

2. Remove `www.cloude.uz -> Abdilatif1909.github.io`.

3. Add A records pointing to the Ahost cPanel server shared/dedicated IP.

Example shape:

```text
cloude.uz      A      <AHOST_CPANEL_SERVER_IP>
www.cloude.uz  A      <AHOST_CPANEL_SERVER_IP>
```

or:

```text
www.cloude.uz  CNAME  cloude.uz
```

Use the exact server IP shown in Ahost cPanel, usually under General Information -> Shared IP Address, or provided by Ahost.

4. In GitHub Pages settings for any old repository using `cloude.uz`, remove the custom domain or disable GitHub Pages for that domain to prevent future confusion.

5. In cPanel Python App:

```text
Application root: /home/cloudeu2/lms
Application startup file: passenger_wsgi.py
Application entry point: application
Application URL: cloude.uz
```

6. Restart the Python application in cPanel after DNS is corrected.

## Expected Result After DNS Fix

After DNS propagation:

```text
https://cloude.uz/health/
```

should return:

```json
{"status":"ok"}
```

and:

```text
https://cloude.uz/
```

should show:

```text
Cloud Education Platform | cloude.uz
```

not:

```text
WebDasturlashEdu
```

## Root Cause

The old website is still being served because DNS for `cloude.uz` and `www.cloude.uz` still points to GitHub Pages. The Ahost Passenger application is not receiving public domain traffic.

No project code change is required to fix the currently observed public behavior. The required fix is DNS/cPanel domain routing configuration.
