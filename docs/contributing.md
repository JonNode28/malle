# Contributing

## Definition of done
* Functionality
* Unit Tests
* Integration (optional but check if appropriate)
* Cypress Tests (optional but check if appropriate)
* Added to example (optional but check if appropriate)

# Testing Units
This project uses both [react-testing-library](https://github.com/testing-library/react-testing-library) and [Enzyme](https://enzymejs.github.io/enzyme/). 

In most cases you should use react-testing-library as this encourages robust tests. Use Enzyme shallow rendering where you absolutely have to assert component state.