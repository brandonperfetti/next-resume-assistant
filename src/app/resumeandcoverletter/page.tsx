'use client'
import { CopilotKit } from '@copilotkit/react-core'
import '@copilotkit/react-textarea/styles.css' // also import this if you want to use the CopilotTextarea component
import { CopilotSidebar } from '@copilotkit/react-ui'
import '@copilotkit/react-ui/styles.css'
import { CoverLetterAndResume } from '../components/resume'

function buildResume() {
	return (
		<CopilotKit url="./../api/copilotkit/chat">
			<CopilotSidebar
				defaultOpen={true}
				labels={{
					title: 'Your Resume Assistant',
					initial: 'Hi! 👋 How can I assist you today?',
				}}
			>
				<CoverLetterAndResume />
			</CopilotSidebar>
		</CopilotKit>
	)
}

export default buildResume
