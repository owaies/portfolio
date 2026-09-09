# Routing Guide

Public navigation uses the home page sections and project detail routes under `/projects/[slug]`.

Authentication and admin routes live under `/auth` and `/admin` and are intentionally excluded from search indexing.

When adding a route, decide whether it is public, authenticated, or administrative before implementing its data access. Add appropriate metadata and a useful not-found or recovery behavior for public routes.
