# SpecVerify

## Test-entity stack

To handle multiple entity validation and nesting of entities SpecVerify uses a stack of entities under stack and entity
classes.

## Assertion file

An **assertion file** consists of a sequence of assertion statements, the ordering represents the last execution order 
preference.

An **assertion statement** has a string description and one or more functions representing assertion bodies.

An **assertion description** should match a statement from a spec file, the match MAY be whitespace insensitive if the 
spec parser can handle that.

An **assertion body** function MAY have parameters, these parameters represent (by name) test entity classes that the 
assertion body applies to, the body is run for each test entity which matches the class. If an assertion body has 
several parameters, it applies when it's last parameter matches by name the currently provided test entity class AND
when the preceding parameter names match test entities down the stack in the same order.

Every **assertion body** MUST contain either an assert or a provide statement. assert or provide statements MAY be 
contained within conditional statements and therefore an applied assertion body will not necessarily always use one of 
these statements.

If an **assert statement** fails, the assertion statement containing it fails as does every assertion lower than it in 
the test-entity stack.

A **provide statement** within an assertion body offers a new test entity (encountered while asserting) to the 
test-entity stack. It's class is used to find which assertion bodies will be applied to it. 

A **oneOf** statement within an assertion body collects several provide or sub-assertion statements where exactly one of 
them should succeed. If one succeeds and the rest fail the oneOf completes successfully. If all fail, the assertion 
statement fails, including the sub-failures. If more than one succeed, the assertion statement fails.

A **sub-assertion statement body** may not have parameters, and may not appear within if-statements or for-statements,
they may appear inside oneOf statements.
