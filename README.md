# FJS

Format JS (`fjs`) is meant to be an __opinionated__ pretty printer for
JavaScript code. Given a snippet of code it will format it. Being highly
configurable is not a goal.

# Implementation / Features

These are the goals `fjs` tries to adhere to. If any of these properties are
violated please open an issue!

## pure

All functionality of `fjs` should be pure functions, given the same input they
produce the same output. There are no side-effects anywhere.

## format agnostic

Code that is formatted should be formatted solely based on the AST. Given an AST
the same output should be printed regardless of any existing formatting.

__Exceptions:__

1. (None yet.)

## constant AST

This process should not change the AST in any way. Modifying the AST is a job
for another tool.

__Exceptions:__

1. (None yet.)

## source maps

__TODO:__

1. I still need to figure out how to do this one :)
2. This is also the level cursor tracking should come from. Probably? That way
any AST changes can be applied and cursors are tracked through them.
