/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getFactory getAssetRegistry getParticipantRegistry request emit */

/**
 * Create Stock with Random Price
 * @param {org.nondeterministic.CreateStock} createStock - the createStock transaction
 * @transaction
 */
async function createStock(stk) {
  const factory = getFactory();
  const namespace = 'org.nondeterministic';
  const stock = factory.newResource(namespace, 'Stock', stk.stockId);
  stock.price = await getPrice();
  console.log('@debug - Stock Price Generated is: USD' + stock.price);
  const ar = await getAssetRegistry(namespace + '.Stock')
  await ar.add(stock);
}

async function getPrice () {
  const priceAsStr = await request.get({uri: 'http://randomnumberserver.example.com:8080/random'});
  const price = parseInt(priceAsStr);
  //const price = Math.floor((Math.random() * 10000) + 1);
  return price;
}
