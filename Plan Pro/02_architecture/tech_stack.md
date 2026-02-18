# Jobarium MVP Tech Stack (Locked Basics)

This document captures the **locked MVP tech stack decisions** based on our architecture discussions.
It is intentionally focused on **platform choices** (not internal service architecture).

## Platform and Hosting (GCP)
- **Cloud provider**: Google Cloud Platform (GCP)
- **Compute**: Cloud Run (containerized services)
- **Edge**: HTTPS Load Balancer + Cloud Armor (WAF) + Cloud CDN
- **Object storage**: Cloud Storage (resumes, attachments, packet exports, extracted text artifacts)
- **Database (system of record)**: Cloud SQL (PostgreSQL)
- **Cache / ephemeral state**: Memorystore (Redis) for rate limits, cooldown locks, short-lived caches
- **Async/eventing**: Pub/Sub (events) + Cloud Tasks (throttled dispatch) + Cloud Scheduler (periodic jobs)
- **Secrets/keys**: Secret Manager (+ KMS as needed)
- **Observability**: Cloud Logging + Monitoring + Trace + Error Reporting

## Frontend
- **Framework**: Angular (TypeScript)
- **Rendering**: SPA (CSR)
- **Hosting**: static build to Cloud Storage behind Cloud CDN / HTTPS Load Balancer

## Backend
- **Framework**: NestJS (TypeScript)
- **Runtime**: Cloud Run
- **API**: HTTP API (REST assumed for MVP; exact contract to be defined later)

## Authentication and Authorization
- **AuthN (authentication)**: Firebase Auth (managed identity service)
  - Angular uses Firebase SDK to sign in and obtain Firebase ID tokens (JWT)
  - NestJS verifies Firebase ID tokens on requests
- **AuthZ (authorization)**: enforced in application/business layer (NestJS)
  - Organization scoping and “self” access control are enforced server-side
  - Detailed policy/permission modeling is deferred

## AI / Matching (Embeddings + Vector Retrieval)
- **Embedding generation**: Vertex AI embeddings
- **Vector storage + retrieval**: Vertex AI Vector Search
- **System-of-record linkage**: Cloud SQL stores authoritative entity records; vector index stores datapoints keyed to those records

## Document parsing
- **Primary extraction**: deterministic parsing for text PDFs + DOCX
- **Fallback for scanned PDFs/images**: Document AI OCR

## Integrations (MVP)
- **Email**: SendGrid
- **SMS**: Twilio
- **Payments**: Stripe

