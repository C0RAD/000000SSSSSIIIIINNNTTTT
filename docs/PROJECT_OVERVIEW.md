# Project Overview

## Purpose

000000SSSSSIIIIINNNTTTT is an OSINT (open-source intelligence) platform for collecting, organizing, correlating, and documenting information from lawfully accessible public sources.

The project should prioritize verifiable findings, clear source attribution, reproducible investigations, and privacy-respecting use.

## Design principles

- **Public-source first:** use public websites, documented APIs, and other sources that permit the intended access.
- **Evidence over assumptions:** keep source URLs, retrieval timestamps, and supporting context with each finding.
- **Modular collection:** implement each source as an isolated connector with consistent input and output contracts.
- **Human review:** distinguish raw observations, inferred relationships, and analyst conclusions.
- **Privacy and safety:** avoid bypassing access controls, collecting credentials, or exposing sensitive personal information without a legitimate and lawful basis.
- **Transparent operation:** document collection behavior, rate limits, errors, and data retention.

## Initial capability areas

1. **Investigation workspace** — organize cases, notes, and collected findings.
2. **Source connectors** — retrieve permitted information from public sources and documented APIs.
3. **Entity normalization** — represent domains, IP addresses, organizations, usernames, and other supported entities.
4. **Relationship analysis** — connect entities while recording the evidence and confidence behind each link.
5. **Search and correlation** — find related observations across an investigation.
6. **Reporting** — produce reports with citations, timestamps, and confidence labels.

## Evidence model

Every collected observation should preserve, where available:

- Source name and canonical URL
- Retrieval timestamp (UTC)
- Collection method and connector version
- Original value or a safe normalized representation
- Case or investigation association
- Confidence and verification status
- Retention or deletion metadata

Do not treat a discovered association as proof that two accounts or entities belong to the same person.

## Development status

This repository is at the initial planning stage. Framework, runtime, persistence layer, and deployment model have not yet been selected. Those decisions should be made before implementation begins.
