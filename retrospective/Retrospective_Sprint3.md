# TEMPLATE FOR RETROSPECTIVE (Team 15)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed (3) vs done (3)
- Total points committed (26) vs done (26)
- Nr of hours planned (115h 30m) vs spent (111h 20m)

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed
- The code was reviewed by at least one other person on the team.
- The code complies with Sonarqube's parameters.

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 28      |        | 67h 30m    | 65h 45m      |
| _#7_  | 11      | 5      | 14h        | 14h 35m      |
| _#8_  | 10      | 8      | 16h        | 15h          |
| _#9_  | 11      | 13     | 18h        | 16h          |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  | | Estimation | Actual |
  | ----- | ---------- | ------------ |
  | average | 1h 55m | 1h 51m |
  | standard deviation | 0.05086 | 0.047698 |
- Total task estimation error ratio: -0.03607

## QUALITY MEASURES

- Unit Testing:

  - Total hours estimated: 12h
  - Total hours spent: 12h
  - Nr of automated unit test cases: 45
  - Coverage:

    ## Code Coverage Summary

    | File             | Statements       | Branches       | Functions      | Lines            |
    | ---------------- | ---------------- | -------------- | -------------- | ---------------- |
    | `src`            | 100% (55/55)     | 60% (6/10)     | 100% (9/9)     | 100% (54/54)     |
    | `src/error`      | 75% (6/8)        | 33.33% (1/3)   | 50% (2/4)      | 75% (6/8)        |
    | `src/middleware` | 94.23% (49/52)   | 88.23% (15/17) | 84.61% (11/13) | 95.91% (47/49)   |
    | `src/model`      | 95.23% (120/126) | 95.4% (83/87)  | 93.33% (28/30) | 95.04% (115/121) |
    | `src/router`     | 84.76% (128/151) | 74.07% (20/27) | 84% (21/25)    | 86.3% (126/146)  |
    | `src/validation` | 90.9% (20/22)    | 66.66% (4/6)   | 100% (1/1)     | 90.9% (20/22)    |
    | `test`           | 100% (12/12)     | 100% (0/0)     | 100% (2/2)     | 100% (12/12)     |

    ### Coverage Totals

    - **Statements:** 91.54% (398/426)
    - **Branches:** 86% (129/150)
    - **Functions:** 88.09% (74/84)
    - **Lines:** 92.23% (388/412)

- E2E testing:
  - Total hours estimated: 4h 30m
  - Total hours spent: 4h
- Code review
  - Total hours estimated: 4h 30m
  - Total hours spent: 4h 30m
- Technical Debt management:
  - Strategy adopted
  - Total hours estimated estimated at sprint planning: 3h 30m
  - Total hours spent: 3h 30m

## ASSESSMENT

- What caused your errors in estimation (if any)?

  - Jest was very slow.

- What lessons did you learn (both positive and negative) in this sprint?

  - API definition is a crucial step in the sprint, everybody has to agree on it and it should be done in a few days.

- Which improvement goals set in the previous retrospective were you able to achieve?

  1. Backend team members ready to work on frontend
  2. Some improvents in adopting common component organization guidelines

- Which ones you were not able to achieve? Why? 2. Reduce frontend complexity, because we had no time and we had to focus on creting new features

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two

  1. Produce working code quickly and optimize it in a second pass
  2. Check and agree on APIs definition quickly

- One thing you are proud of as a Team!!
  - We're proud of how our app is growing
