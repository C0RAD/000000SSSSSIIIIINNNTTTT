# Development Roadmap

This roadmap is an initial proposal. Items should be refined as the project's language, framework, and deployment goals are selected.

## Phase 0 — Foundations

- [ ] Choose language, runtime, and application framework.
- [ ] Define supported operating environments.
- [ ] Establish coding standards, formatting, and test tooling.
- [ ] Define a threat model and acceptable-use policy.
- [ ] Decide on storage, retention, and export requirements.

## Phase 1 — Core data model

- [ ] Define investigation and case records.
- [ ] Define entity types and normalized identifiers.
- [ ] Define evidence and source-provenance records.
- [ ] Add confidence and verification states.
- [ ] Write schema validation and unit tests.

## Phase 2 — Collection framework

- [ ] Define a common connector interface.
- [ ] Add request timeouts, retries, and per-source rate limits.
- [ ] Respect source terms, robots policies where applicable, and API restrictions.
- [ ] Record collection timestamps and connector versions.
- [ ] Add fixtures and tests that do not depend on live targets.

## Phase 3 — Analysis

- [ ] Add entity search and deduplication.
- [ ] Add evidence-backed relationship records.
- [ ] Add timeline and relationship views.
- [ ] Keep observed facts separate from inferred conclusions.

## Phase 4 — Reporting and operations

- [ ] Generate reports with source citations.
- [ ] Add audit logging and configurable retention.
- [ ] Add security review and dependency scanning.
- [ ] Document installation, configuration, and safe operation.

## Initial release criteria

- Every finding has traceable provenance.
- Collection respects source access rules and configured rate limits.
- Inferences are visibly distinguished from verified observations.
- Tests cover core data validation and connector behavior.
- Documentation explains limitations, data handling, and acceptable use.
