# Notation

This page covers all of the notation that this library currently supports, which mostly matches up with [alg.cubing.net](https://alg.cubing.net/) and [alpha.twizzle.net](https://alpha.twizzle.net/edit).

## SiGN Notation

The standard notation that is used by the majority of the cubing community is what's known as *SiGN Notation*.

### Basic Moves

The basic moves are as follows:

- The standard face turns, including **U**, **L**, **F**, **B**, **R**, and **D**
- Slice turns, including **M**, **E**, and **S**
- Rotations, including **x**, **y**, and **z**

These turns *will not* be explained here, and if you need to brush up on any of the aforementioned turns, please refer to [this](https://www.speedsolving.com/wiki/index.php?title=NxNxN_Notation) (or [this](https://www.speedsolving.com/wiki/index.php?title=SiGN_notation) or [this](https://www.mzrg.com/rubik/nota.shtml), for SiGN notation, but it doesn't fully match with what I'm covering here).

### Wide Moves

For a double wide move, both **Rw** and **r** (for example) mean the same thing. That is, turn the two rightmost layers clockwise. Additionally, a number before an **Rw** or **r** signifies how many layers should be turned simultaneously:

- **3Rw** or **3r** means to turn the 3 rightmost layers clockwise (this is the whole
cube on a 3x3)
- By extension, **\<N>Rw** or **\<N>r** means to turn the \<N> rightmost layers clockwise
(and this is the same for any other face turn)
- **1Rw** or **1r** are the same as **R**

While we can now construct a solution to any position on any NxN using the above notation, this is still not as flexible as it could be. For example, what if you wanted to turn *only* the second-farthest-to-the-right layer clockwise (which would be equivalent to **Rw R'**)? There is no way to express this using the above notation as a single turn.

### Any Layer Turns

A simple addition to the notation solves the above issue. If I want to turn a single internal layer, that can be done by appending a number in front of one of the basic face turns. For example, **2R** denotes turning the second internal layer from the R face clockwise:

<script defer type="module" src="/cubelib.js"></script>
<puzzle-viewer size="5" alg="2R"></puzzle-viewer>

Additionally, for wide moves, two numbers can be prepended to a move to specify the layers to turn. For example, **2-3Rw** indicates that the second and third rightmost layers should be turned clockwise. Additionally, **1-3Rw** would be exactly the same as **3Rw**, so there would be no reason to use the former in this case. Here is **2-3Rw**:

<puzzle-viewer size="5" alg="2-3Rw"></puzzle-viewer>

TODO: Slice moves

### Move Groupings

A sequence of moves can be grouped into parentheses or brackets, as long as opening/closing parentheses/brackets match. For example, J Perm, which is **R U R' F' R U R' U' R' F R2 U' R' U'**, can be written as **(R U R' F') (R U R' U') R' F R2 U' R' U'**. This can be useful for grouping together certain triggers to make it easier to learn the alg. However, when a certain sequence comes up multiple times, parentheses can be a dramatic improvement, since move modifiers can be applied to these groups of moves. For example, **(R U R' U')6** means to apply the four inner moves six times consecutively, and **(U R U' R')6'** means to apply the four inner moves six times in reverse.

TODO: Commutators, conjugates, and variables