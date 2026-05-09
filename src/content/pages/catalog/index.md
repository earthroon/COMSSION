---
title: "Vehicle Catalog"
slug: "catalog"
layout: "default"
theme: "showroom"
description: "Vehicle catalog list and detail pages."
kind: "page"
status: "active"
visibility: "public"
order: 10
---

# Vehicle Catalog

Registered vehicles are rendered from `public/data/vehicle-catalog.json`.

::vehicle-catalog
title: Vehicle list
intro: Browse vehicle cards and open detail pages.
data: data/vehicle-catalog.json
cardLinkMode: route
detailBasePath: /catalog
showSearch: true
showFilters: true
copyPhone: true
defaultSort: order
emptyTitle: No vehicles
emptyBody: There are no registered vehicles yet.
::
