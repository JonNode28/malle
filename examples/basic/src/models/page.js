import { ValidationExecutionStage } from "microo-core";
import { JsonSchemaNodeValidator } from "microo-validator-jsonschema";
import { AllValidationExecutionStages } from "microo-core";

export default {
  id: 'page',
  name: 'Page',
  descriptions: 'A page in a blog',
  type: 'object',
  children: [
    {
      id: 'title',
      name: 'Title',
      description: 'The page title',
      type: 'string',
      validation: [
        new JsonSchemaNodeValidator({
          error: 'Cannot be more than 255 characters long',
          executeOn: AllValidationExecutionStages,
          schema: {
            "maxLength": 255
          },
          displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
        }),
        new JsonSchemaNodeValidator({
          error: 'Must be at least 1 character long',
          executeOn: AllValidationExecutionStages,
          schema: {
            "minLength": 1
          },
          displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
        }),

      ]
    },
    {
      id: 'author',
      name: 'Author',
      description: 'The author',
      type: 'object',
      children: [
        {
          id: 'name',
          name: 'Name',
          type: 'string',
          validation: [
            new JsonSchemaNodeValidator({
              error: 'Must be at least 1 character long',
              executeOn: AllValidationExecutionStages,
              schema: {
                "minLength": 1
              },
              displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
            })
          ]
        },
        {
          id: 'location',
          name: 'Location',
          type: 'string'
        }
      ]
    },
    {
      id: 'body',
      name: 'Body',
      description: 'The content of the page',
      type: 'string'
    },
    {
      id: 'tags',
      name: 'Tags',
      description: 'Page tags',
      type: 'list',
      listItemType: 'string',
      children: [
        {
          id: 'tag',
          name: 'Tag',
          description: 'A tag',
          type: 'string',
          default: '',
          validation: [
            new JsonSchemaNodeValidator({
              error: 'Cannot be more than 255 characters long',
              executeOn: AllValidationExecutionStages,
              schema: {
                "minLength": 1
              },
              displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
            })
          ],
        }
      ]
    }
  ],
  validation: [

  ],
}