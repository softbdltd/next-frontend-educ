
//mapping data from component props <level>
export const dynamicLevelTypes : any = {
  "dashboard.TotalBatches" : 'dashboard.Batches',
  "dashboard.TotalEnrolments": 'dashboard.Enrolments',
  "dashboard.SkillsTrend": 'dashboard.Skills'
}


interface DashData {
  sector_name : string,
    value: number
}
interface ChartData {
  month: number,
  enrollments: number
}

export const lineChartData:ChartData[] = [

    {
      "month": 1,
      "enrollments": 0
    },
    {
      "month": 2,
      "enrollments": 2
    },
    {
      "month": 3,
      "enrollments": 0
    },
    {
      "month": 4,
      "enrollments": 12
    },
    {
      "month": 5,
      "enrollments": 12
    },
    {
      "month": 6,
      "enrollments": 3
    },
    {
      "month": 7,
      "enrollments": 0
    },
    {
      "month": 8,
      "enrollments": 0
    },
    {
      "month": 9,
      "enrollments": 0
    },
    {
      "month": 10,
      "enrollments": 0
    },
    {
      "month": 11,
      "enrollments": 0
    },
    {
      "month": 12,
      "enrollments": 0
    },

]
export const totalCourseData:any = [

  {
    "month": 1,
    "total_courses": 0
  },
  {
    "month": 2,
    "total_courses": 2
  },
  {
    "month": 3,
    "total_courses": 0
  },
  {
    "month": 4,
    "total_courses": 12
  },
  {
    "month": 5,
    "total_courses": 12
  },
  {
    "month": 6,
    "total_courses": 3
  },
  {
    "month": 7,
    "total_courses": 5
  },
  {
    "month": 8,
    "total_courses": 0
  },
  {
    "month": 9,
    "total_courses": 3
  },
  {
    "month": 10,
    "total_courses": 0
  },
  {
    "month": 11,
    "total_courses": 7
  },
  {
    "month": 12,
    "total_courses": 0
  },

]
export const listOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November','December'];

export const listOfMonthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct', 'Nov','Dec'];

//Sector wise Courses
export const dashData:DashData[] = [
  {sector_name: 'January', value: 2},
  {sector_name: 'February', value: 18},
  {sector_name: 'March', value: 9},
  {sector_name: 'April', value: 6},
  {sector_name: 'May', value: 11},
  {sector_name: 'June', value: 8},
  {sector_name: 'July', value: 2},
  {sector_name: 'August', value: 18},
  {sector_name: 'September', value: 9},
  {sector_name: 'October', value: 6},
  {sector_name: 'Pharma', value: 6},
  {sector_name: 'Software', value: 11},
  {sector_name: 'December', value: 8},
  {sector_name: 'IT', value: 11},
  {sector_name: 'December', value: 8},
  {sector_name: 'June', value: 8},

]

// Pie chart 16 colors
export const COLORS = ['#92316d','#d4b82f','#c3bfa1','#fc554b','#7acf9a','#84066a','#364cb5','#b9a477',
  '#03b223','#1e1929','#5068e2','#e7a467','#14db08','#83239f','#a9cc24','#cc79f0'];