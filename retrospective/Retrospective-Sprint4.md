# TEMPLATE FOR RETROSPECTIVE (Team 15)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed (4) vs done (4)
- Total points committed (25) vs done (25)
- Nr of hours planned (109h 30m) vs spent (114h 20m)

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
| _#0_  | 27      | -      | 73h        | 75h 20m      |
| _#19_ | 6       | 5      | 10h        | 10h 30m      |
| _#10_ | 6       | 13     | 11h 30m    | 11h 30m      |
| _#20_ | 5       | 2      | 6h 30m     | 6h 30m       |
| _#14_ | 5       | 5      | 8h 30m     | 10h 30m      |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean   | StDev |
| ---------- | ------ | ----- |
| Estimation | 2h 14m | 0.089 |
| Actual     | 2h 20m | 0.092 |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

  0.044140

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

  0.107831

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 10h
  - Total hours spent: 10h 30m
  - Nr of automated unit test cases:
  - Coverage:
- E2E testing:
  - Total hours estimated: 11h 30m
  - Total hours spent: 12h
  - Nr of test cases: 102
  - Manual tests: 70
- Code review
  - Total hours estimated: 4h
  - Total hours spent: 3h 30m
- Technical Debt management:
  - Strategy adopted: [TD strategy](https://github.com/umberto-fontanazza/kiruna-explorer/blob/2c6c87e004ba9e604be6c4e21f24a400f5dccde4/retrospective/TD%20strategy.md)
  - Total hours estimated estimated: 3h 30m
  - Total hours spent: 3h 15m

## ASSESSMENT

- What caused your errors in estimation (if any)?

  - Adopting libraries never used before.

- What lessons did you learn (both positive and negative) in this sprint?

  - Enthusiasm in development is the driving force for quality.
  - Team fatigue must be managed
  - The best man for the job is not always the most skilled one but the most interested about that piece of the application
  - Libraries are not always speeding up development

- Which improvement goals set in the previous retrospective were you able to achieve?

  Goals set in previous sprint were not applicable to this sprint.

- Which ones you were not able to achieve? Why?

  Previous sprint goals were not applicable since there was no backend change.

- One thing you are proud of as a Team?
