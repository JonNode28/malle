export default {
  id: 'page',
  name: 'Page',
  properties: {
    title: {
      name: 'Title',
      description: 'The page description',
      type: 'string',
      validations: [
        { options: { "maximum": 255 }, errorMessage: 'Cannot be more than 255 characters long' },
        { options: { "minimum": 1 }, errorMessage: 'Must be at least 1 character long' }
      ]
    }
  }
}