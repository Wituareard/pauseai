import { options } from '$lib/api.js'
import type { Person } from '$lib/types.js'
import { error, json } from '@sveltejs/kit'

function recordToPerson(record: any): Person {
	return {
		id: record.id || 'noId',
		name: record.fields.Name,
		bio: record.fields.bio,
		title: record.fields.title,
		image: record.fields.image && record.fields.image[0].thumbnails.large.url,
		privacy: record.fields.privacy,
		org: record.fields.organisation,
		checked: record.fields.checked
	}
}

const currentOrg = 'International'

const filter = (p: Person) => {
	return p.image && !p.privacy && p.checked && p.org?.includes(currentOrg)
}

export async function GET({ fetch }) {
	const url = `https://api.airtable.com/v0/appWPTGqZmUcs3NWu/tblZhQc49PkCz3yHd`

	const response = await fetch(url, options)
	if (!response.ok) {
		throw new Error('Failed to fetch data from Airtable')
	}
	const data = await response.json()
	try {
		const out: Person[] = data.records
			.map(recordToPerson)
			.filter(filter)
			// Shuffle the array, although not truly random
			.sort(() => 0.5 - Math.random())
		return json(out)
	} catch (e) {
		console.log('err while transforming airtable data', e)
		return error(500, 'err')
	}
}
