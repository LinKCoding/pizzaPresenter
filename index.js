let faker = require('faker');
const { random } = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Sets the headers id and titles of the CSV
const csvWriter = createCsvWriter({
  path: 'sample.csv',
  header: [
    { id: 'size', title: 'SIZE' },
    { id: 'toppings', title: 'TOPPINGS' },
    { id: 'customerName', title: 'CUSTOMERNAME' },
    { id: 'total', title: 'TOTAL' }
  ]
});

// Creating an array of objects that have a pizza side and an associated base price for the size
let sizesAndPrices = [
  {
    size: 10,
    price: 12
  }, 
  {
    size: 12,
    price: 15
  }, 
  {
    size: 14,
    price: 18
  }
]

// Attributing toppings with a multipler against the base price (that's determined by size)
let toppingAndMutiplier = [
  {
    topping: 'cheese',
    multiplier: 1
  },
  {
    topping: 'pepperoni',
    multiplier: 1.3
  }, 
  {
    topping: 'extra cheese',
    multiplier: 1.2
  },
  {
    topping: 'mushrooms',
    multiplier: 1.1
  }
]

// A factory function that allows the creation of a pizza with at least 1 topping, and at most 2 toppings
function pizzaFactory() {
  let randomSizeIdx = Math.floor(Math.random() * 3)
  let randomAmtOfToppings = Math.floor(Math.random() * 2) + 1
  let toppings = []
  if(randomAmtOfToppings === 1) {
    let randomToppingIdx = Math.floor(Math.random() * 4)
    toppings.push(toppingAndMutiplier[randomToppingIdx])
  } else {
    let randomToppingIdx1 = Math.floor(Math.random() * 4)
    let randomToppingIdx2 = Math.floor(Math.random() * 4)
    while(randomToppingIdx2 === randomToppingIdx1) {
      randomToppingIdx2 = Math.floor(Math.random() * 4)
    }
    toppings.push(toppingAndMutiplier[randomToppingIdx1], toppingAndMutiplier[randomToppingIdx2])
  }
  

  let pizza = sizesAndPrices[randomSizeIdx]
  pizza.toppings = toppings

  return pizza
}

// Create 25 customers (for 40 orders)
let customers = []

for(let i = 0; i < 25; i++) {
  customers.push(faker.fake("{{name.firstName}} {{name.lastName}}"))
}

let records = []

// Creating 40 orders of pizza, there is only 1 pizza per order at the moment 
for(let i = 0; i < 40; i++) {
  let pizza = pizzaFactory();
  let randomCustomerIdx = Math.floor(Math.random() * 26)
  console.log(randomCustomerIdx > 25, randomCustomerIdx)

  // This could be a separate function... 
  let newRecord = {}
  newRecord.size = pizza.size 
  newRecord.toppings = pizza.toppings.map(el => el.topping)
  newRecord.toppings = JSON.stringify(newRecord.toppings)
  let totalMultiplier = pizza.toppings.reduce((a,c) => {
   return a * c.multiplier 
  }, 1)
  newRecord.total = pizza.price * totalMultiplier
  newRecord.total = newRecord.total.toFixed(2)
  newRecord.customerName = customers[randomCustomerIdx]
  records.push(newRecord)
}

csvWriter.writeRecords(records)       // returns a promise
  .then(() => {
    console.log('...Done');
  });
