---
title: "차량 목록"
slug: "catalog"
layout: "default"
theme: "showroom"
description: "카반하다 차량 목록과 상세 페이지입니다."
kind: "page"
status: "active"
visibility: "public"
order: 10
---

# 차량 목록

등록 차량은 `public/data/vehicle-catalog.json` 데이터를 기준으로 렌더링됩니다.

:::vehicle-catalog
title: 등록 차량
intro: 차량 카드를 확인하고 상세 페이지로 이동합니다.
data: data/vehicle-catalog.json
cardLinkMode: route
detailBasePath: /catalog
showSearch: true
showFilters: true
copyPhone: true
defaultSort: order
emptyTitle: 등록 차량 없음
emptyBody: 아직 등록된 차량이 없습니다.
:::
