/**
 * @template T extends string
 * @param {T[]} elements 
 * @returns {{ [K in T]: number }}
 */
function enumOf(elements) {
    const obj = {
        fromInt: function (i) {
            return Object.values(this).find(e => e == i)
        }
    }

    for (let i = 0; i < elements.length; i++) {
        const element = {}


        Object.setPrototypeOf(element, Number)
        element.valueOf = () => i

        Object.defineProperty(element, 'toString', {
            value: () => elements[i], 
            writable: false,
            enumerable: false,
            configurable: false
        })

        obj[elements[i]] = Object.seal(element)
    }


    return Object.seal(obj);
}

let Entity = enumOf(['HUMAN', 'ANIMAL', 'PLANT'])

console.log(Entity.fromInt(0).toString())

console.log(Entity.HUMAN.toString()) // 0
console.log(Entity.ANIMAL.toString()) // 1
console.log(Entity.PLANT.toString()) // 2

console.log(Entity.HUMAN == 0)
console.log(Entity.ANIMAL == 1) 
console.log(Entity.PLANT == 2)

