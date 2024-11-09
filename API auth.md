| Route                       | Urban planner | Developer | Resident | Visitor |
| --------------------------- | ------------: | --------: | -------: | ------: |
| GET /documents              |            ✅ |        ✅ |       ✅ |      ✅ |
| GET /document/:id           |            ✅ |        ✅ |       ✅ |      ✅ |
| POST /documnets             |            ✅ |        ❌ |       ❌ |      ❌ |
| PATCH /documents/:id        |            ✅ |        ❌ |       ❌ |      ❌ |
| DELETE /documents/:id       |            ✅ |        ❌ |       ❌ |      ❌ |
| GET /documents/:id/links    |            ✅ |        ✅ |       ✅ |      ✅ |
| PUT /documents/:id/links    |            ✅ |        ❌ |       ❌ |      ❌ |
| DELETE /documents/:id/links |            ✅ |        ❌ |       ❌ |      ❌ |
| POST /sessions              |            ❌ |        ❌ |       ❌ |      ✅ |
| GET /sessions/current       |            ✅ |        ✅ |       ✅ |      ❌ |
| DELETE /sessions/current    |            ✅ |        ✅ |       ✅ |      ❌ |
| POST /users                 |            ❌ |        ❌ |       ❌ |      ✅ |
