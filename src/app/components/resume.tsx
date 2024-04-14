// import React from "react";
import {
	useCopilotAction,
	useMakeCopilotReadable,
} from '@copilotkit/react-core'
import jsPDF from 'jspdf'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { useGithubData } from './githubdata'

export const CoverLetterAndResume = () => {
	const { resumeData } = useGithubData()
	const [createCoverLetterAndResume, setCreateCoverLetterAndResume] = useState({
		letter: '',
		resume: '',
	})

	useMakeCopilotReadable(JSON.stringify(resumeData))

	useCopilotAction(
		{
			name: 'createCoverLetterAndResume',
			description:
				'Create a cover letter and resume for a software developer job application.',
			parameters: [
				{
					name: 'coverLetterMarkdown',
					type: 'string',
					description:
						'Markdown text for a cover letter to introduce yourself and briefly summarize your professional background as a software developer.',
					required: true,
				},
				{
					name: 'resumeMarkdown',
					type: 'string',
					description:
						'Markdown text for a resume that displays your professional background and relevant skills.',
					required: true,
				},
			],
			handler: async ({ coverLetterMarkdown, resumeMarkdown }) => {
				setCreateCoverLetterAndResume(prevState => ({
					...prevState,
					letter: coverLetterMarkdown,
					resume: resumeMarkdown,
				}))
			},
		},
		[],
	)

	function addTextToPDF(doc: any, text: any, x: any, y: any, maxWidth: any) {
		// Split the text into lines
		const lines = doc.splitTextToSize(text, maxWidth)

		// Add lines to the document
		doc.text(lines, x, y)
	}

	function markdownToPlainText(markdown: string) {
		return markdown
			.replace(/#### (.*)/g, '    $1\n')
			.replace(/### (.*)/g, '  $1\n')
			.replace(/## (.*)/g, ' $1\n')
			.replace(/# (.*)/g, '$1\n')
			.replace(/\*\*(.*)\*\*/g, '$1')
			.replace(/\*(.*)\*/g, '$1')
			.replace(/!\[(.*?)\]\((.*?)\)/g, '') // Remove images
			.replace(/\[(.*?)\]\((.*?)\)/g, '$1 (link)') // Replace links with text
			.replace(/\n/g, '\n')
	}

	const plainLetter = markdownToPlainText(createCoverLetterAndResume.letter)
	const plainResume = markdownToPlainText(createCoverLetterAndResume.resume)

	useCopilotAction(
		{
			name: 'downloadPdfs',
			description: 'Download pdfs of the cover letter and resume.',
			parameters: [
				{
					name: 'coverLetterPdfA4',
					type: 'string',
					description:
						'A Pdf that contains the cover letter converted from markdown text and fits A4 paper.',
					required: true,
				},
				{
					name: 'resumePdfA4Paper',
					type: 'string',
					description:
						'A Pdf that contains the resume converted from markdown text and fits A4 paper.',
					required: true,
				},
			],
			handler: async () => {
				const marginLeft = 10
				const marginTop = 10
				const maxWidth = 180

				const coverLetterDoc = new jsPDF()
				addTextToPDF(
					coverLetterDoc,
					plainLetter,
					marginLeft,
					marginTop,
					maxWidth,
				)
				coverLetterDoc.save('coverLetter.pdf')

				const resumeDoc = new jsPDF()
				addTextToPDF(resumeDoc, plainResume, marginLeft, marginTop, maxWidth)
				resumeDoc.save('resume.pdf')
			},
		},
		[createCoverLetterAndResume],
	)

	// Update Cover Letter
	const updateLetter = createCoverLetterAndResume.letter

	useMakeCopilotReadable('Cover Letter:' + JSON.stringify(updateLetter))

	useCopilotAction(
		{
			name: 'updateCoverLetter',
			description:
				'Update cover letter for a software developer job application.',
			parameters: [
				{
					name: 'updatedCoverLetterMarkdown',
					type: 'string',
					description:
						'Update markdown text for a cover letter to introduce yourself and briefly summarize your professional background as a software developer.',
					required: true,
				},
			],
			handler: async ({ updatedCoverLetterMarkdown }) => {
				setCreateCoverLetterAndResume(prevState => ({
					...prevState,
					letter: updatedCoverLetterMarkdown,
				}))
			},
		},
		[updateLetter],
	)

	// Update Resume
	const updateResume = createCoverLetterAndResume.resume

	useMakeCopilotReadable('Resume:' + JSON.stringify(updateResume))

	useCopilotAction(
		{
			name: 'updatedResume',
			description: 'Update resume for a software developer job application.',
			parameters: [
				{
					name: 'updatedResumeMarkdown',
					type: 'string',
					description:
						'Update markdown text for a resume that displays your professional background and relevant skills.',
					required: true,
				},
			],
			handler: async ({ updatedResumeMarkdown }) => {
				setCreateCoverLetterAndResume(prevState => ({
					...prevState,
					resume: updatedResumeMarkdown,
				}))
			},
		},
		[updateResume],
	)

	return <CoverLetterResume {...createCoverLetterAndResume} />
}

type CoverLetterResumeProps = {
	letter: string
	resume: string
}

const CoverLetterResume = ({ letter, resume }: CoverLetterResumeProps) => {
	return (
		<div className="px-4 sm:px-6 lg:px-8 bg-slate-50 py-4">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-3xl font-semibold leading-6 text-gray-900">
						Resume Builder
					</h1>
				</div>
			</div>
			{/* Resume Start */}
			<div className="mt-8 flow-root bg-slate-200">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4 p-2">
							Resume
						</h2>
						<div className="min-w-full divide-y divide-gray-300 p-2">
							<div className="divide-y divide-gray-200 bg-white p-4">
								{resume ? (
									<Markdown className="markdown">{resume}</Markdown>
								) : (
									<p>Ask your assistant to create a resume.</p>
								)}{' '}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Cover Letter Start */}
			<div className="mt-8 flow-root bg-slate-200">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4 p-2">
							Cover Letter
						</h2>
						<div className="min-w-full divide-y divide-gray-300 p-2">
							<div className="divide-y divide-gray-200 bg-white p-2">
								{letter ? (
									<Markdown className="markdown">{letter}</Markdown>
								) : (
									<p>Ask your assistant to create a cover letter.</p>
								)}{' '}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
