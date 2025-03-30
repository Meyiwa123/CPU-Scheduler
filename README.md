# CPU Scheduling Visualizer
![CPU Scheduling Visualizer](https://github.com/Meyiwa123/CPU-Scheduler/public/logo.png)

An interactive web application for visualizing and understanding CPU scheduling algorithms used in operating systems. This educational tool helps students and professionals learn how different scheduling algorithms work and how they affect system performance metrics.

## 🚀 Features

- **Interactive Visualization**: Watch CPU scheduling algorithms in action with step-by-step animation
- **Multiple Algorithms**: Experiment with FCFS, SJF, SRTF, Priority Scheduling, and Round Robin
- **Process Management**: Create, edit, and remove processes with custom parameters
- **Real-time Statistics**: View performance metrics like waiting time, turnaround time, and response time
- **Educational Content**: Learn about each algorithm's characteristics and use cases
- **Beautiful UI**: Engaging interface with animated background and responsive design

## 🛠️ Technologies Used

- **Next.js**: React framework for building the application
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **shadcn/ui**: For UI components
- **Framer Motion**: For animations and transitions

## 📋 Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

## 🔧 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Meyiwa234/CPU-Scheduler.git
   cd CPU-Scheduler
2. Install dependencies:
   ```bash
   npm install
3. Run the development server:
    ```bash
    npm run dev
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 How to Use
### Creating Processes
1. Select a scheduling algorithm from the dropdown menu
2. Enter process parameters (arrival time, burst time, priority if applicable)
3. Click "Add Process" to add it to the process list
4. Repeat to add multiple processes

### Running the Simulation
1. After adding processes, click "Run Simulation"
2. Use the animation controls to:
    * Start/pause the animation
    * Step forward or backward
    * Adjust animation speed
3. Switch between the Gantt Chart and Statistics tabs to view different aspects of the simulation

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.