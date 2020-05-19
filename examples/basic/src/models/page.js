import { JsonSchemaPropertyValidator } from 'microo-validator-jsonschema';
import { ValidationExecutionStage } from "microo-core";

export default {
  id: 'page',
  name: 'Page',
  properties: [
    {
      id: 'title',
      name: 'Title',
      description: 'The page description',
      type: 'string',
      validation: [
        new JsonSchemaPropertyValidator({
          error: 'Cannot be more than 255 characters long',
          executeOn: [
            ValidationExecutionStage.CHANGE,
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
        new JsonSchemaPropertyValidator({
          error: 'Must be at least 1 character long',
          executeOn: [
            ValidationExecutionStage.CHANGE,
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
    }
  ],
  validation: {

  },
  display:{
    edit: [
      // {
      //   type: 'column',
      //   children: [
      //     {
      //       type: 'row',
      //       options: {
      //         fraction: 2/3,
      //       },
      //       children: [
      //         { type: 'property', options: { property: 'title' } }
      //       ]
      //     },
      //     {
      //       type: 'row',
      //       options: {
      //         fraction: 1/3
      //       },
      //       children: [
      //         { type: 'property', options: { property: 'authorName' } }
      //       ]
      //     }
      //   ]
      // },
      'title',
      'authorName',
      { type: 'property', typeRenderer: 'multiline-string', options: { property: 'body' } }
    ]
  }
}