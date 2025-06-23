export const pageHeadingAndGuidanceHTML = `
<div class="govuk-checkboxes__conditional" id="conditional-pageHeadingAndGuidance">
      <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="pageHeading">
    Page heading
  </label>
  <div id="pageHeading-hint" class="govuk-hint">
    Page headings should be a statement and not a question. For example, 'Passport information'
  </div>
  <input class="govuk-input" id="pageHeading" name="pageHeading" type="text" value="Where do you live?" aria-describedby="pageHeading-hint">
</div>

  <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="guidanceText">
    Guidance text (optional)
  </label>
  <div id="guidanceText-hint" class="govuk-hint">
    Use Markdown to format the content or add hyperlinks
  </div>
  <textarea class="govuk-textarea" id="guidanceText" name="guidanceText" rows="3" aria-describedby="guidanceText-hint">Guidance text</textarea>
</div>
<details class="govuk-details">
  <summary class="govuk-details__summary">
    <span class="govuk-details__summary-text">
                                Help with markdown
                              </span>
  </summary>
  <div class="govuk-details__text">
    <h3 class="govuk-heading-s">Headings and subheadings</h3>
    <p class="govuk-body">Use one hash symbol followed by a space for a heading, for example:
                              </p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md"># This is a heading</code></pre>
    <p class="bottom-gutter-1-3">To add a subheading, use 2 hash symbols:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">## This is a subheading</code></pre>

    <h3 class="govuk-heading-s" id="bullets">Bullet points</h3>
    <p class="govuk-body">Use bullet points to help words or phrases stand out in your emails
                                and letters.</p>
    <p class="govuk-body">Copy this example to add bullet points:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">Introduce bullet points with a lead-in line ending in a colon:

* leave one empty line space after the lead-in line
* use an asterisk or a dash followed by a space to add an item
* start each item with a lowercase letter, do not end with a full stop
* leave one empty line space after the last item</code></pre>

    <h3 class="govuk-heading-s" id="bullets">Numbered steps</h3>
    <p class="govuk-body">Copy this example to add numbered steps:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">1. Leave one empty line space before starting your list.
2. Enter a number followed by a full stop and a space to add an item.
3. Start each item with a capital letter and end it with a full stop.
4. Leave one empty line space after the last item.</code></pre>

    <h3 class="govuk-heading-s">Links and URLs</h3>
    <p class="govuk-body">To convert text into a link, use square brackets around the link
                                text and round brackets around the full URL. Make sure there are no spaces between the
                                brackets or the link will not work. For example:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">[Apply now](https://www.gov.uk/example)</code></pre>

  </div>
</details>
    </div>
`
