/**
 * @param {boolean} isLive
 * @param {string} slug
 */
const overviewOrgDetailsChanges = (isLive, slug) => {
  const changableItems = []
  if (!isLive) {
    changableItems.push(
      {
        href: '/library/' + slug + '/edit/lead-organisation',
        text: 'Change',
        visuallyHiddenText: 'lead organisation'
      },
      {
        href: '/library/' + slug + '/edit/team#teamName',
        text: 'Change',
        visuallyHiddenText: 'teamName'
      },
      {
        href: '/library/' + slug + '/edit/team#teamEmail',
        text: 'Change',
        visuallyHiddenText: 'teamEmail'
      }
    )
  }

  return changableItems
}

export default overviewOrgDetailsChanges
