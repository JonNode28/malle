# Graphter
A generic data management framework.

Your data is not so special. Graphter aims to be a framework that can be used to manage _any_ data structure, starting with its own configuration files.

1. Generic - compose any data structure from primitive data types
1. Modular & Swappable - just a series of interfaces with some pre-built implementations
1. Customisable - easily take control where needed
1. Frontend agnostic - it manages data, what you do with it is up to you

## Packages
1. Core - framework interfaces
1. Renderer - iterates model configuration and renders CMS UI
    1. React
    1. Angular (roadmap)
1. Content Types - a basic set of content types
    1. React
    1. Angular (roadmap)
1. Validator - validates your data, client and server side
    1. JsonSchema
    1. YUP (roadmap)
1. Data
    1. Local: PouchDB
1. API 
    1. GraphQL schema generator
    1. Apollo bootstrapper
    1. Express bootstrapper (roadmap)
    1. Koa bootstrapper (roadmap)
1. Infrastructure Provisioner
    1. Terraform: AWS AppSync + Lambda + S3
1. Persistence
    1. Primary
        1. PouchDB (browser)
        1. MongoDB
        1. Postgres (roadmap)
        1. MySQL (roadmap)
        1. MariaDB (roadmap)
    1. Search
        1. FlexSearch.js (browser)
        1. Elasticsearch
    1. File
        1. Filesystem
        1. S3 (roadmap)
1. Event Emitter
    1. AppSync subscription
    1. SQS (roadmap)
    
## Definition of done
* Functionality
* Unit Tests
* Cypress Tests (optional but check if appropriate)
* Added to example (optional but check if appropriate)

## Contributing
See [Contributing Docs](./docs/contributing.md)