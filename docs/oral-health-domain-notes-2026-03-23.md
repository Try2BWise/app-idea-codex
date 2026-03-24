# Oral Health Domain Notes

Updated: 2026-03-23

## Purpose

This note collects source-backed oral-health guidance for the SmileSteps proof of concept. It is written for future product planning, copywriting, and content review. The app itself should keep a warm, calm, age-appropriate voice and avoid diagnosis or treatment advice.

## High-confidence takeaways

### Daily brushing habits

- Brush twice a day.
- For children, a practical routine is after the first meal and after the last meal of the day.
- Brush for 2 minutes each time.
- Use a child-sized toothbrush with soft bristles.
- Use gentle circles and brush the fronts, backs, and chewing surfaces.
- Young children usually still need adult help or supervision. The HRSA materials say many children under age 7 or 8 cannot brush well on their own yet.

### Fluoride toothpaste amounts

- Before age 3: use a smear about the size of a grain of rice.
- Ages 3 to 6: use a pea-sized amount.
- Fluoride helps strengthen enamel and helps protect against cavities.
- After brushing, children can spit out the extra toothpaste. The HRSA handout says they do not need to rinse, because the small amount left behind helps the teeth.

### Baby teeth and early care

- Start cleaning the mouth even before teeth erupt by wiping gums with a clean, damp cloth or gauze.
- Begin brushing as soon as the first tooth appears.
- Most baby teeth begin to erupt around 6 months, though timing varies.
- Most children have a full set of 20 baby teeth by around age 3.
- Baby teeth matter because they help with eating, speaking, spacing, and healthy permanent teeth development.

### First dental visit

- Schedule the first dental visit after the first tooth appears and no later than the first birthday.
- A first visit is usually short and focused on checking growth, looking for early problems, and coaching parents on daily care.
- It helps to choose a time when the child is rested, fed, and not at naptime.
- Positive framing can reduce fear: practice opening wide, read books, and describe the visit as a helpful check-in rather than something scary.

### Flossing and cleaning between teeth

- Brushing is essential, but it does not fully clean between teeth.
- ADA guidance recommends cleaning between teeth once a day.
- In a child-facing app, this should be phrased simply and introduced gently, especially for older kids and teens.

### Sealants

- Sealants are thin protective coatings placed on the chewing surfaces of back teeth.
- They are not a substitute for brushing or flossing.
- They can lower cavity risk in molars significantly.
- First molars often come in around age 6 and second molars around age 12, which is why those ages often come up in sealant discussions.
- Kid-friendly metaphor: sealants are like a raincoat for the bumpy tops of back teeth.

### Dental tools and anxiety reduction

- A mouth mirror helps the dentist see around the mouth.
- A suction tool removes water so the mouth stays comfortable.
- An explorer or probe helps the dentist check tooth surfaces.
- A scaler removes plaque or tartar that brushing cannot reach.
- Cotton pliers are used to place or move small items like cotton rolls.
- A periodontal probe is a measuring tool used to check gum areas.
- Tool explainers should focus on purpose and comfort, not sharpness or fear.

### Parent-facing caution areas

- The app should not diagnose pain, infection, or tooth problems.
- It can explain routines, tools, and what usually happens at visits.
- It can encourage families to contact their dentist or orthodontic team when something feels unusual, painful, or urgent.

## Product implications

### Strong app content candidates

- Brushing coach that reinforces 2 minutes, twice a day, gentle circles, and adult help for younger kids.
- First dental visit explainer for parents.
- Meet the Tools cards for mirror, suction, explorer, and scaler.
- Baby teeth basics and eruption timeline content.
- Sealants explainer for school-age kids.
- Calm dental-visit prep cards.

### Good parent-dashboard reminders

- First tooth = time to plan first dental visit.
- Grain-of-rice toothpaste under 3; pea-sized from 3 to 6.
- Brushing support still matters through early elementary years.
- Ask the dentist about sealants when back molars come in.

### Content tone guidance

- Use short sentences.
- Prefer concrete language over technical terms.
- Reassure without talking down to the child.
- Explain what a tool does before naming it.
- For kids, describe sensations and purpose, not risk.
- For parents, separate “what is common” from “ask your dentist if you’re unsure.”

## App-ready copy ideas

### Kid-friendly lines

- "The tiny mirror helps the dentist peek around corners."
- "The suction straw is like a little vacuum for water."
- "Back teeth have bumpy tops, so they need extra careful brushing."
- "A sealant is like a raincoat for the grooves on a tooth."
- "Brush in little circles and visit every side of each tooth."

### Parent-friendly lines

- "Start brushing with fluoride toothpaste as soon as the first tooth appears."
- "Use a smear the size of a grain of rice before age 3, then a pea-sized amount from ages 3 to 6."
- "Plan the first dental visit by the first tooth or first birthday, whichever comes first."
- "Children often need brushing help well beyond preschool."

## Source notes

### Local PDFs processed

1. `C:\Users\bwise\Downloads\taking-care-your-childs-oral-health.pdf`
   - HRSA handout.
   - Key points: clean gums before teeth erupt, grain-of-rice smear before age 3, pea-sized amount ages 3 to 6, brush after first and last meal, first visit by first tooth or first birthday.
2. `C:\Users\bwise\Downloads\brushing-your-childs-teeth.pdf`
   - HRSA handout.
   - Key points: brush twice daily, soft child-sized brush, small circles, adult supervision under about 7, spit but do not rinse, make brushing playful with a timer or song.

### Web sources used

- [AAP Oral Health Resources for Families](https://www.aap.org/en/patient-care/oral-health/oral-health-resources-for-families/)
- [MouthHealthy: First Dental Visit for Baby](https://www.mouthhealthy.org/life-stages/babies-and-kids/first-dental-visit-for-baby)
- [MouthHealthy: Sealants](https://www.mouthhealthy.org/all-topics-a-z/sealants)
- [MouthHealthy: Flossing](https://www.mouthhealthy.org/all-topics-a-z/flossing)
- [MouthHealthy: Babies and Kids Healthy Habits](https://www.mouthhealthy.org/life-stages/babies-and-kids/healthy-habits-babies-and-kids)
- [MouthHealthy: Baby Teeth](https://www.mouthhealthy.org/all-topics-a-z/baby-teeth/)
- [WebMD: Dental Health and Your Child's Teeth](https://www.webmd.com/oral-health/dental-health-your-childs-teeth)
- [Meister Surgical: Dental Instruments Pictures and Names PDF](https://meistersurgical.com/dental-instruments-pictures-and-names-pdf/)

## Gaps and follow-up work

- Verify any eruption timeline UI against a dedicated pediatric dentistry source before presenting exact month ranges in-app.
- Replace placeholder Spanish with reviewed family-facing translation.
- Add a source review pass with a pediatric dentist before publishing any “learn” content broadly.
- Build a separate parent-only content layer for more detailed guidance that should not appear in child mode.

## Processing note

I was able to process the two local PDFs directly after installing a PDF reader library. The linked `scienceinsights.org` page could not be fetched in this environment, so tool explanations above were grounded primarily in ADA-style patient education plus the Meister Surgical instrument overview used as a secondary naming reference.
