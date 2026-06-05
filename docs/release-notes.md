# Release notes

## 2026-06-05

### Multiple answer selection in conditions, with a filter box for long lists

Conditions can now match against **more than one answer option** for question
types that present a list of choices — **Checklist**, **Radio**, **Autocomplete**
and **Select List**. Previously a condition could only be tied to a single
answer; you can now select several options on a single condition.

How the selected options are combined depends on the question type:

- **Checklist** (checkboxes) questions let the author choose explicitly, via a
  _"How do you want to combine these checkbox selections?"_ control with two
  options — **All must be met (AND)** or **Any can be met (OR)**.
- **Radio**, **Autocomplete** and **Select List** (single-answer) questions
  derive the combination from the operator: a **positive** match (e.g. _"Is in"_)
  combines the selected options with **OR** (the answer can be any of them),
  while a **negative** match (e.g. _"Is not in"_) combines them with **AND** (the
  answer must not be any of them).

To keep long lists manageable, the answer-value editor now shows a **filter
box** above the options whenever a list has **more than 10 options**. Typing in
the box filters the visible options as you type, with a _Clear filter_ button
and a "_N items hidden. Show all_" link to reset. The filter is a progressive
enhancement: it is added by client-side JavaScript and is purely client-side
(the filter input is never submitted with the form). When JavaScript is
unavailable, the full list of options is shown as before, and the filter box is
absent rather than simply hidden. Shorter lists (10 or fewer options) are left
unchanged, as they are easy to scan without filtering.
