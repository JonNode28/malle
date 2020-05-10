export default {
  id: 'page',
  name: 'Page',
  properties: [
    {
      id: 'title',
      name: 'Title',
      description: 'The page description',
      type: 'string',
      validations: [
        { options: { "maximum": 255 }, errorMessage: 'Cannot be more than 255 characters long' },
        { options: { "minimum": 1 }, errorMessage: 'Must be at least 1 character long' }
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