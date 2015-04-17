# SpecVerify

## Test-entity stack

To handle multiple entity validation and nesting of entities SpecVerify uses a stack of test-entities.

For each state of the test entity stack, each assertion body is check for a match. An assertion body matches the stack 
if the last entity name on the stack matches the last entity name of the body's parameters and the other body arguments 
match some other elements of the stack (these must be in order but may be sparse).

## Result tree

Results are expressed raw as a tree of all the states of the test-entity stack, with each node attached to the 
assertions it matched and the results of those assertions.

## Assertion file

An **assertion file** consists of a sequence of assertion statements, the ordering represents the last execution order 
preference. It has access to the console and require members of the global object (if available). 

An **assertion statement** has a string description and either a function representing an assertion body or multiple 
hasCase sub-assertions.

An **assertion description** should match a statement from a spec file, the match MAY be whitespace insensitive if the 
spec parser can handle that.

An **assertion body** function MAY have parameters, these parameters represent (by name) test entity classes that the 
assertion body applies to, the body is run for each test entity which matches the class. If an assertion body has 
several parameters, it applies when it's last parameter matches by name the currently provided test entity class AND
when the preceding parameter names match test entities down the stack in the same order.

Every **assertion body** SHOULD contain either some kind of assertion or a provide statement. These statements MAY be 
contained within conditional statements and therefore an applied assertion body will not necessarily always use one of 
these statements.

A **hasCase sub-assertion** is evaluated in the same way as an assertion statement, but for the parent assertion 
statement to pass, exactly one hasCase statement must pass. Assertions bodies of cases must have the same parameters.

If an **assertion** fails, the assertion statement containing it fails as does every assertion lower than it in 
the test-entity stack.

A **provide statement** within an assertion body offers a new test entity (encountered while asserting) to the 
test-entity stack. It's class is used to find which assertion bodies will be applied to it. 

A **oneOf** statement within an assertion body collects several provide ---or sub-assertion--- statements where exactly one of 
them should succeed. If one succeeds and the rest fail the oneOf completes successfully. If all fail, the assertion 
statement fails, including the sub-failures. If more than one succeed, the assertion statement fails.

A **sub-assertion statement body** may not have parameters, and may not appear within if-statements or for-statements,
they may appear inside oneOf statements.


## Todo

* Use [esprima](https://www.npmjs.com/package/esprima) and an improved spec to make a validator for SpecVerify assertion 
files.
