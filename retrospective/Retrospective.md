TEMPLATE FOR RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed (4) vs. done (?) 
- Total points committed (13) vs. done (?)
- Nr of hours planned (96h 15m) vs. spent (as a team) (98h 20m)

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed 

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    15   |        | 34h 35m    |   40h 30m    |
| _#1_   |    10   |    2   |     19h    |    21h 50m   |
| _#2_   |    9    |    2   | 18h 20m    |      19h     |
| _#3_   |    8    |    1   |  13h 20m   |      7h      |
| _#4_   |    5    |    8   |    11h     |      10h     |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average estimate: 19h 15m
- Hours per task average actual: 19h 40m
- Standard deviation (estimate and actual):
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$ 

    Total estimation error ratio: `0.021645`
 
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    Absolute relative task estimation error: `0.050583`
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: `10h 30m`
  - Total hours spent: 2 + 5 + 2 = `7h 30m`
  - Nr of automated unit test cases: 
  - Coverage (if available): 
- E2E testing:
  - Total hours estimated: `10h 30m`
  - Total hours spent: `12h`
- Code review 
  - Total hours estimated: `6h` 
  - Total hours spent: `7h 30m`

## ASSESSMENT

What caused your errors in estimation (if any)?
1. Documents fields were added mid sprint (story 1 was only title + description).
2. Lacking knowledge of libraries.
3. Inexperience with branch management and PR submission process.
4. API keys being pushed and .env management.
5. Google maps API speed up the work on the front end much more than expected.
6. The tests were done first with a full mockup and then we had to modified all the tests.

What lessons did you learn (both positive and negative) in this sprint?
1. Frontend and backend need to be integrated ASAP and often.
2. Reviews are useful only if the reviewer has context and domain specific expertise.
3. It is easier and simpler to test when the task is fully completed than from a document.

Which improvement goals set in the previous retrospective were you able to achieve?
1. Introduce a commit or PR good practices checklist - ✓
2. Add less dependencies - ✓
3. Less learning tasks - ✓
4. Choose tecnologies that we are comfortable with - ✓
5. Starting from API draft - ~ partially because it needed edits

Which ones you were not able to achieve? Why?

One thing you are proud of as a Team
1. Our authentication module.
2. Perfect linting.
3. Frontend team picked up quickly new stuff.
  
