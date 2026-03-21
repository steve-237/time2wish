# Skill: Frontend Testing

## Goal
Protect feature changes with focused unit tests.

## Strategy
- Test services (HTTP calls, mapping, business logic).
- Test critical components (auth, forms, navigation).
- Mock external dependencies.
- Cover both success and failure scenarios.

## Useful Commands
```bash
npm run test -- --watch=false --browsers=ChromeHeadless
npm run lint
npm run build
```

## Checklist
- [ ] New services include tests.
- [ ] Form components validate input and error states.
- [ ] CI runs lint + tests + build.
