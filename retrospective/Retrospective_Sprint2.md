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
- Nr of hours planned (117h 30m) vs. spent (as a team) (107h 45m)

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed 

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    29   |        | 75h 30m    |   73h 05m    |
| _#2_   |    9    |    2   |     18h    |   17h 30m    |
| _#5_   |    8    |    2   | 13h 30m    |   12h 30m    |
| _#6_   |    7    |    1   | 10h 30m    |    4h 40m    |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average estimate: 2h 08m
- Hours per task average actual: 1h 57m
- Standard deviation (estimate and actual):1.298523	1.300582
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$ 

    Total estimation error ratio: `-0.08298`
 
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    Absolute relative task estimation error: `0.238088`
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 
  - Total hours spent: 
  - Nr of automated unit test cases: 
  - Coverage (if available): 
- E2E testing:
  - Total hours estimated: 12h
  - Total hours spent: 11h 45m
- Code review 
  - Total hours estimated: 
  - Total hours spent: 

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