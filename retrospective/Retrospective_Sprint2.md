TEMPLATE FOR RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed (3) vs. done (3) 
- Total points committed (10) vs. done (10)
- Nr of hours planned (122h) vs. spent (as a team) (112h 50m)

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed 

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    31   |        | 78h        |   74h 10m    |
| _#2_   |    9    |    2   |     18h    |   17h 30m    |
| _#5_   |    8    |    5   | 13h 30m    |   12h 30m    |
| _#6_   |    7    |    3   | 12h 30m    |    8h 40m    |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average estimate: 2h 13m
- Hours per task average actual: 2h 03m
- Standard deviation including the Story 0 (Technical one) (estimate and actual):1.323204-1.285484
- Standard deviation without the Story 0 (Technical one) (estimate and actual):0.122072-0.184562
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$ 

    Total estimation error ratio: `-0.07514`
 
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    Absolute relative task estimation error: `0.22824`
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 10h
  - Total hours spent: 5h 45m
  - Nr of automated unit test cases: 25
  - Coverage (if available): 
- E2E testing:
  - Total hours estimated: 12h
  - Total hours spent: 11h 45m
- Code review 
  - Total hours estimated: 11h 30m
  - Total hours spent: 11h 15m

## ASSESSMENT

What caused your errors in estimation (if any)?


What lessons did you learn (both positive and negative) in this sprint?


Which improvement goals set in the previous retrospective were you able to achieve?


Which ones you were not able to achieve? Why?

One thing you are proud of as a Team

Coordination and Planning
- Are Scrum Meetings performed regularly?

  Meetings are held every Monday and last 15 minutes.
- Is workload among team members balanced?

- Is workload of members close to the expected one?

- Are user stories moved to sprint boards according to 
planning and actual development?

  Yes, the user stories have been moving with respect to priorities and are done in order of plan.
- Is task size consistent with guidelines?

  Yes the average task size is 2 hours.
- Are tasks estimated?

  Yes all the tasks are estimated.
- Is time spent on tasks tracked?

  Yes, the spent time is tracked.
- Are all sprint boards complete with planned tasks?

- Are there estimated and tracked technical tasks?

  Yes, all tasks are tracked.
- Are retrospectives conducted collectively?

  Yes, they are done in a group call where we review the statistics and see what went wrong or what went wrong.
- Are retrospectives filled with meaningful and precise data? 

  Yes all statistics are extracted from youtrack, and give important information for possible improvements or weaknesses or strengths.
- Do retrospectives generate concrete and verifiable improvements in next sprint?

DEVELOPMENT AND QUALITY ASSURANCE
- Is the definition of done fully respected?

- Are all functionalities of a story working properly?

- Is priority of backlog respected?

- Is there evidence of manual testing?

  Yes, there are videos, notes and also screenshots.
- Are test data for demo prepared in advance?

- Is deployment of container tested on more than a pc?

-  Are the instructions to run your docker image present on DockerHub or GitHub?

- Is documentation of the release complete (e.g., credentials, readme, etc.)?

- Are GitHub issues promptly opened after giving feedback?

- Is follow-up activity on a feedback GitHub issue properly tracked?