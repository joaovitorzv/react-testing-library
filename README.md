[![Netlify Status](https://api.netlify.com/api/v1/badges/05a3e754-bcc7-437f-b70d-1e0954aa74f4/deploy-status)](https://app.netlify.com/sites/react-testing-library/deploys)

<p align="center">
  <h1 align="center">
    A React project with tests coverage. see <a href='https://react-testing-library.netlify.app/'>live here</a>
  </>
</p>

<p align="center">
  <img alt='project screenshot' src='https://raw.githubusercontent.com/joaovitorzv/react-testing-library/master/assets/project-screenshot.png'/>
</p>

### Development Roadmap

The main goal of this project is the tests coverage

**Project features:**
	
 - React Testing Library (of course)
 - Input Masking 
 - Its own tab navigation
 - A cool Skeleton loading

**A little context of what this does**
  
  My goal with this project was to develop something simple where I can apply a full coverage with tests, the project consists in one page that has a tab navigation (made by hand) where you can search for a zip code by typing your addres or verify which address your zip code refers to.

## Cool things i've done during the process

***API mocked response***

To test if everything is ok whenever a user make a request, was used MSW (Mock Service Worker) to mock all the API calls, the FindCep final request is something like this:

```ts
  const server = setupServer(
  ...other requests
  
  rest.get('https://viacep.com.br/ws/:uf/:city/:street/json', (req, res, ctx) => {
    const { city, street } = req.params
    return res(ctx.json([
      {
        cep: '14404-254',
        logradouro: street,
        localidade: city,
      }
    ]))
  })
)
```
there is only returned the data that i need on my test case and it works just fine


***Interaction with html select tag*** 

When searching for a zip code by an address the user must send his address, to make this easyer is used the `<select />` with every brazilian states and when one state are picked is fetched all its cities and rendered on another `<select />` and then the user just have to write the street name

To interact with the `<select />` i've used the `userEvent` (that provides a more advanced interaction than the `fireEvent`) to capture the options of state was defined a `data-testid` and searched for `userEvent.selectOptions(getByTestId('state-options'), ['SP'])` here we are passing its defined `data-testid` and passing an array with what we want to select, as our form is not multiple choice we just pass only one string inside the array, when we wait until the cities is returned from the mocked API using `waitFor(() => getByRole('option', { name: /franca/i }))`, then we proceed and select the city like we did with state and finally we search for the street name `userEvent.type(getByPlaceholderText('Nome da rua'), 'Hon')` getting the input by its placeholder and searching for the street.

  > You provably saw that we just searched for `Hon` instead of the complete street name, thats because we start to make requests to the API on every change up to 3 characters and return the ones that match

***The last 3 searches*** 

When user search for an address using a zip code the last three successful searches is shown below the input and stored on localstorage if user come back, to test that we need to fill the input 4 times and hope that the first zip code we searched isn't there anymore we ended up with our test like that

```ts
    const { getByRole, queryByRole } = render(<VerifyCep />)
    const input = getByRole('textbox')

    for (let i = 0; i <= 4; i++) {
      let cepValue = `14404-25${i}`

      fireEvent.change(input, { target: { value: cepValue } })
      await waitFor(() => getByRole('button', { name: new RegExp(cepValue, 'i') }))
    }

    expect(queryByRole('button', { name: /14404-250/i })).not.toBeInTheDocument()
```

### Built With
* [React](https://reactjs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [React-testing-library](https://testing-library.com/docs/react-testing-library/intro/)
* [Classnames](https://www.npmjs.com/package/classnames)
* [react-loading-skeleton](https://www.npmjs.com/package/react-loading-skeleton)

### How to setup locally

1. Clone the repo
   ```sh
   git clone https://github.com/joaovitorzv/react-testing-library
   ```
2. Change to cloned directory
   ```sh
   cd react-testing-library
   ```
3. Install YARN or NPM packages
   ```sh
   yarn install
   ```
4. Run the project
   ```sh
   yarn start
   ```
