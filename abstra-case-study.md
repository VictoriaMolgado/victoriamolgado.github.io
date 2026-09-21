# A low-code tool for developers: composing internal applications in VS Code with Python

Product designer: Victoria Molgado  
User research ✢ Design system ✢ User interface

<!-- Hero visual: show the finished internal tool, then reveal that the interface is assembled inside VS Code. -->

## Context

In search of product-market fit, Abstra was exploring whether a low-code tool could help developers build internal applications with less interface work.

The thesis was that internal tools carry complex interactions, but developers often build them without dedicated design support. Abstra could take on that work through widgets that already accounted for layout, styling, and interaction states.

<!-- Visual: a finished dashboard or internal tool built with Abstra. -->

## Scope

Abstra Dashboards was a VS Code plugin for composing interfaces from ready-made widgets, connecting them to business rules in Python, and deploying internal tools within the developer's coding workflow.

The visual builder had to reduce interface work without limiting how engineers wrote business logic. The design question was where to give developers control and where the system should make a decision for them.

<!-- Visual: empty canvas → drag a component → snap it into place → edit its label in the Inspector → add Python logic. -->

## Specificity

The design system was the widgets' main specification. It had to define how components behaved together, so developers could assemble a complex tool without designing every interaction themselves.

Placement was one of those decisions. Free positioning made layout errors easy to introduce. The grid was responsible for positioning, while components carried their own spacing, including 8px internal padding. This separated choosing where a widget belonged from adjusting the space inside it.

Containers needed their own rules. A sidebar could act as a canvas, but it did not have the same purpose or room as the main workspace. Later interaction specifications made that boundary explicit: a smaller set of components could be dropped into a sidebar, while modals had three canvas sizes. Reusing the composition model still required defining what each container could accept.

Those specifications also separated editing from testing. In editing, selecting a widget would expose its properties in the Inspector, with changes reflected on the canvas. In testing, the canvas would respond as the finished tool, with a way back to editing. The same click needed a clear meaning in each mode: configure the component or use it.

<!-- Visual sequence: place a widget and show its spacing; compare the main canvas with a sidebar and modal; select a widget, edit its label in the Inspector, then use it in testing mode. Container restrictions, modal sizes, Inspector binding, and edit/testing behavior are documented in the later Specs page; show these as specified interactions until their original implementation is confirmed. -->

## Specificity

The theme settings gave developers a small set of meaningful decisions. One HEX value was enough to define a brand color; the system would derive the variations needed for links, buttons, selections, and light or dark interfaces.

That color had to work across surfaces and states. The later theme specification kept light and dark surfaces fixed and required the generated colors to preserve contrast with backgrounds and labels. Developers could bring their brand without having to assemble and maintain a palette themselves.

Widget states were part of the same responsibility. The later interaction specifications covered button hover and click states, text-input selection, errors and clearing, and corresponding selector behavior. A clean default appearance was only useful if the component remained understandable when someone interacted with it.

Components were flexible in their purpose and restrained in their styling. The system aimed to make Abstra recognizable through consistent composition while leaving room for the client's brand. For the original builder, interviews with the implemented version were used to look for blind spots and inform revisions.

<!-- Visual pair: change one HEX value across light and dark surfaces; show an input selected, in an error state, and cleared, alongside the corresponding selector states. Fixed surfaces and detailed widget states are specified in the later Specs page. -->

## Outcome

At launch, the plugin recorded 7,000 downloads on its first day. A YouTube overview spread organically, and VS Code featured Abstra on the Marketplace homepage for two weeks.

The launch brought visibility, but left the commercial question open: would the developers using the tool also buy it? The design addressed the effort of building an internal interface; finding a sustainable market also depended on understanding who would pay for that work.

✢ ✢ ✢

<!--
Editorial checks before publishing:
- Verify the source and definition of the 7,000-download figure.
- Verify the dates and evidence for the YouTube distribution and VS Code Marketplace placement.
- Confirm the public product name. The sources alternate between “Abstra Dashs,” “Abstra Dashboards,” “plugin,” and “platform.”
- Confirm Victoria's exact project duration, responsibilities, collaborators, and the number and profile of interview participants.
- Confirm whether the users-versus-buyers conclusion accurately expresses the source's statement that “developers don't buy software.”
- Container restrictions, three modal sizes, Inspector binding, edit/testing modes, fixed theme surfaces, and detailed widget states come from the later Specs page. They are described as specifications, not confirmed shipped behavior; confirm their relationship to the original project before publishing.
- Source mapping: Context and launch claims — Narrativa; grid responsibility, spacing, sidebar-as-canvas, restrained personality, and implemented-version interviews — Design System; container restrictions, modes, Inspector binding, fixed theme surfaces, and detailed widget states — Specs. The explanation of what a click means in each mode is editorial synthesis of the specified mode distinction.
- Resolve the discrepancy between the intended row-stacking grid and the later absolute two-dimensional positioning described in the specs.
- Treat the later implementation handoff and its 21 automated tests as supporting material only if they can be tied to the original 2023 launch.

Sources:
- Abstra Narrativa: https://app.notion.com/p/molgado/Abstra-Narrativa-142015e6ffce8066a647efe4892b12c1?source=copy_link
- Abstra Specs: https://app.notion.com/p/molgado/Abstra-Specs-3a4015e6ffce8087922ac13c95a32c57?source=copy_link
- Abstra Design System: https://app.notion.com/p/molgado/Abstra-Design-Sytem-c2a3840ff52149b99777621c57af154a?source=copy_link
- Structural reference: ./vtex-releases.html
-->
