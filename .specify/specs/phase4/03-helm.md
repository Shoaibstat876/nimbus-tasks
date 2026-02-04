# Phase IV — Helm Specification

## Chart Structure
- templates/
- values.yaml
- Chart.yaml

## Values
- image.repository
- image.tag
- service.port
- ingress.host

## Installation
- helm install nimbus ./helm/nimbus -n nimbus
- helm list -n nimbus

## Upgrade Rule
- helm upgrade only
- No uninstall during proof
