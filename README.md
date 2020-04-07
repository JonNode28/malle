# Malle
The CMS that does less than any other. 

Most CMSs do way too much and end up cause more problems than they save.

By comparison, Malle is:
1. Generic - compose the data structure you want to manage from primitive data types
1. Modular & Swappable - just a series of interfaces with some pre-built implementations for you to use if you like
1. Frontend agnostic - Malle manages data, what you do with it is up to you

## Packages
1. Renderer - iterates model configuration and renders CMS UI
    1. React
    1. Angular (roadmap)
1. Content Types - set of content types
    1. React
    1. Angular (roadmap)
1. Validator - validates your data
    1. JsonSchema
    1. YUP (roadmap)
1. API - a backend interface
    1. GraphQL schema generator
    1. Apollo bootstrapper
    1. Express bootstrapper (roadmap)
    1. Koa bootstrapper (roadmap)
1. Infrastructure Provisioner
    1. AWS AppSync + Lambda + CloudFront + S3
1. Validator - validates your data
1. Persistence Adaptors
    1. Primary
        1. MongoDB
        1. Postgres (roadmap)
        1. MySQL (roadmap)
        1. MariaDB (roadmap)
    1. Search
        1. Elasticsearch
    1. File
        1. Filesystem
        1. S3 (roadmap)
1. Event Emitter
    1. AppSync subscription
    1. SQS (roadmap)
    
## Specifications

### API
Malle requires certain backend functionality be available
* List
    * Filter
    * Sort
    * Search
    * Autocomplete
* Save
* Delete