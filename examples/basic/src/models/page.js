import { ValidationExecutionStage } from "microo-core";
import { JsonSchemaNodeValidator } from "microo-validator-jsonschema";

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
          executeOn: [
            ValidationExecutionStage.CLIENT_UPDATE,
            ValidationExecutionStage.CLIENT_CREATE,
            ValidationExecutionStage.SERVER_UPDATE,
            ValidationExecutionStage.SERVER_CREATE
          ],
          schema: {
            "maxLength": 255
          },
          displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
        }),
        new JsonSchemaNodeValidator({
          error: 'Must be at least 1 character long',
          executeOn: [
            ValidationExecutionStage.CLIENT_UPDATE,
            ValidationExecutionStage.CLIENT_CREATE,
            ValidationExecutionStage.SERVER_UPDATE,
            ValidationExecutionStage.SERVER_CREATE
          ],
          schema: {
            "minLength": 1
          },
          displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
        }),

      ]
    },
    {
      id: 'authorName',
      name: 'Author',
      description: 'The name of the author',
      type: 'string',
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
              executeOn: [
                ValidationExecutionStage.CLIENT_UPDATE,
                ValidationExecutionStage.CLIENT_CREATE,
                ValidationExecutionStage.SERVER_UPDATE,
                ValidationExecutionStage.SERVER_CREATE
              ],
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