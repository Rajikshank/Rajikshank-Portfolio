 
import { TextScramble } from '../lib/useScramble'

const Experience = () => {
  return (
    <div className='font-Intel my-20'>

        <TextScramble speed={0.40} text='Experience' textsize='text-lg' font='font-Intel'/>
        {/* <h1 className='text-orange-500  font-semibold text-lg'>Experience</h1> */}

        <div className='px-2 mt-4'>
            <div>
              <h1 className='text-gray-200'>Intern Full Stack Developer</h1>
              <h3 className='text-md text-gray-400'>SPM Technologies(2025)</h3>
              <p className='text-gray-200'>Contributed to the Saas Apps developed with Nextjs ,nestjs </p>
            </div>
        </div>
    </div>
  )
}

export default Experience