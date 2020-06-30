# Updating JavaScript Object Property

Let's say you have an array of objects and you want to create a function that will update each object in that array.

And let's say you've written this code:

<figure class="figure">
<pre>
<code class="language-js">
const object1 = { property1: "Value 1" };
const object2 = { property2: "Value 2" };

const listOfObjects = [object1, object2];
const copyOfListOfObjects = [...listOfObjects];

function updateObjects(objects) {
  return objects.map((object) => {
    Object.keys(object).forEach((property) => {
      object[property] = "Updated value";
    });

    return object;
  });
}

const listOfUpdatedObjects = updateObjects(listOfObjects);

console.log(listOfObjects);
console.log(copyOfListOfObjects);
console.log(listOfUpdatedObjects);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 1</figcaption>
</figure>

What will be the output of `console.log(listOfObjects);` statement?

From the first look `listOfObjects` should have two objects: `{ property1: "Value 1" }` and `{ property2: "Value 2" }`, because we didn't change `listOfObjects` - we passed it to `updateObjects` function as an argument and then returned a new list of updated objects using `.map()` function.

Remember that `.map()` returns a brand new array.

So it looks like `listOfObjects` should not be changed.

What will be the output of `console.log(copyOfListOfObjects);` statement?

It's a copy of `listOfObjects` and we didn't do anything else with `copyOfListOfObjects`, so it's easy to assume that it should have two objects `{ property1: "Value 1" }` and `{ property2: "Value 2" }`, just like `listOfObjects` does.

What will be the output of `console.log(listOfUpdatedObjects);` statement?

Now that's a result of calling `updateObjects` function and passing `listOfObjects` to it, so it should have two objects with updated values: `{ property1: "Updated value" }` and `{ property2: "Updated value" }`, correct?

Not quite.

If you run the code, you might be surprised to find out that all three `console.log` statements output updated two objects: `{ property1: "Updated value" }` and `{ property2: "Updated value" }`.

What? How did that happen?

Let's go through that code once more time and think carefully about what it does.

First we declare two objects:

<figure class="figure">
<pre>
<code class="language-js">
const object1 = { property1: "Value 1" };
const object2 = { property2: "Value 2" };
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2</figcaption>
</figure>

Not only we declare two objects `{ property1: "Value 1" }` and `{ property2: "Value 2" }`, but we also assign them to `object1` and `object2` constants.

What value do we exactly assign to `object1` and `object2`? In JavaScript, we don't assign objects. We assign _references_ to those objects. In other words, `object1` stores a reference to an object `{ property1: "Value 1" }` and `object2` stores a reference to an object `{ property2: "Value 2" }`.

This is important to understand.

Then we create two lists - `listOfObjects` and `copyOfListOfObjects`:

<figure class="figure">
<pre>
<code class="language-js">
const object1 = { property1: "Value 1" };
const object2 = { property2: "Value 2" };

const listOfObjects = [object1, object2];
const copyOfListOfObjects = [...listOfObjects];
</code>
</pre>
<figcaption class="figure-caption">Code snippet 3</figcaption>
</figure>

`listOfObjects` is made of `object1` and `object2`. It's not made of `{ property1: "Value 1" }` and `{ property2: "Value 2" }`. It's made of references to `{ property1: "Value 1" }` and `{ property2: "Value 2" }`.

Then we create a copy of `listOfObjects`: `[...listOfObjects]` and we call it `copyOfListOfObjects`. What exactly are we copying here? We're not copying objects `{ property1: "Value 1" }` and `{ property2: "Value 2" }`. Instead, we're copying references to `{ property1: "Value 1" }` and `{ property2: "Value 2" }`.

Now `listOfObjects` stores two references to two objects and `copyOfListOfObjects` stores another two references to exactly the same two objects.

This matters: we copied references, but they all point to the same objects. We _didn't copy_ the objects themselves.

There's still only two objects exist: `{ property1: "Value 1" }` and `{ property2: "Value 2" }`.

Then we called `updateObjects` function and passed `listOfObjects` as an argument to that function. And we've assigned the return value to `listOfUpdatedObjects`:

<figure class="figure">
<pre>
<code class="language-js">
const object1 = { property1: "Value 1" };
const object2 = { property2: "Value 2" };

const listOfObjects = [object1, object2];
const copyOfListOfObjects = [...listOfObjects];

function updateObjects(objects) {
  return objects.map((object) => {
    Object.keys(object).forEach((property) => {
      object[property] = "Updated value";
    });

    return object;
  });
}

const listOfUpdatedObjects = updateObjects(listOfObjects);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 4</figcaption>
</figure>

What exactly have we passed to `updateObjects` function as an argument? A list of references to two objects: `{ property1: "Value 1" }` and `{ property2: "Value 2" }`.

What `updateObjects` does?

<figure class="figure">
<pre>
<code class="language-js">
function updateObjects(objects) {
  return objects.map((object) => {
    Object.keys(object).forEach((property) => {
      object[property] = "Updated value";
    });

    return object;
  });
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5</figcaption>
</figure>

It iterates over `objects` and for each object it iterates over each property of that object and updates its value to `Updated value`.

The only caveat here is that `updateObjects` function doesn't iterate objects. It iterates references to objects.

Let's refactor that function and introduce better names:

<figure class="figure">
<pre>
<code class="language-js">
function updateObjects(referencesToObjects) {
  return referencesToObjects.map((referenceToObject) => {
    Object.keys(referenceToObject).forEach((property) => {
      referenceToObject[property] = "Updated value";
    });

    return referenceToObject;
  });
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 6</figcaption>
</figure>

Now it's clearer what the function does. However, there's one line where it actually changes the object's property: `referenceToObject[property] = "Updated value";`

When you see a line of code like this - this should raise a red flag in your mind.

Why?

Think about what it does. It takes one of the references to an object and then it uses that reference to get access to the actual value stored inside of that object. And then it updates the existing value with a new value - `"Updated value"`.

In other words - it mutates the original object that we've declared at the very beginning of our code.

What's the problem?

Think about this: you can have many references to one object, as we do in our example. We have multiple references to `{ property1: "Value 1" }` object. All those references point to the same object. And when we take one of those references and use it to accesses values inside of our object and update those values - all other references will now point to that updated object. And you might not be aware of this and assume that other references still point to the previous version of that object with original values.

What's the solution?

Do not mutate objects. Because when you do that, no other reference knows about the fact that the object has changed. This will create bugs in your code.

Instead of mutating existing objects - create new objects.

Let's improve our `updateObjects` function:

<figure class="figure">
<pre>
<code class="language-js">
function updateObjects(objects) {
  return objects.map((object) => {
    const newObject = {...object};
    
    Object.keys(newObject).map((property) => {
      newObject[property] = "Updated value";
    });

    return newObject;
  });
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 7</figcaption>
</figure>

The solution is to copy `object`: `const newObject = {...object};` and then update value of a copy: `newObject[property] = "Updated value";` and return that copy `return newObject;`. The original object remains unchanged.

Now when you run this code, the first two console statements will output two lists that are made of `{ property1: "Value 1" }` and `{ property2: "Value 2" }` objects and the third console statement will output a list made of `{ property1: "Updated value" }` and `{ property2: "Updated value" }`.

As expected.

## Conclusion

Avoid `object[property] = "Updated value";` code whenever possible. Instead create a copy and update that copy. Do not mutate objects.

What do you think?



