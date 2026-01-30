
export interface BankQuestion {
  question: string;
  options?: string[];
  answer: string;
  hint?: string;
  explanation: string;
}

export const MATH_BANK: Record<string, BankQuestion[]> = {
  "Primary / Junior School": [
    { question: "What is the square root of 144 plus the cube root of 27?", options: ["15", "18", "12", "9"], answer: "15", explanation: "sqrt(144) = 12, cbrt(27) = 3. 12 + 3 = 15." },
    { question: "Find the value of x: 3x - 7 = 14.", options: ["7", "6", "8", "21"], answer: "7", explanation: "3x = 21, so x = 7." },
    { question: "What is 15% of 200?", options: ["20", "30", "45", "15"], answer: "30", explanation: "0.15 * 200 = 30." },
    { question: "How many sides does a heptagon have?", options: ["7", "6", "8", "9"], answer: "7", explanation: "A heptagon is a 7-sided polygon." },
    { question: "What is 3/4 of 100?", options: ["75", "50", "25", "80"], answer: "75", explanation: "(3/4) * 100 = 75." },
    { question: "A rectangle has a length of 8cm and a width of 5cm. What is its perimeter?", options: ["26cm", "40cm", "13cm", "20cm"], answer: "26cm", explanation: "Perimeter = 2(l + w) = 2(8 + 5) = 26cm." },
    { question: "What is 5 cubed?", options: ["125", "25", "15", "75"], answer: "125", explanation: "5 * 5 * 5 = 125." },
    { question: "If 5 pencils cost $2.50, how much do 12 pencils cost?", options: ["$6.00", "$5.50", "$7.00", "$6.50"], answer: "$6.00", explanation: "Cost per pencil = $2.50 / 5 = $0.50. 12 * $0.50 = $6.00." },
    { question: "What is the sum of angles in a triangle?", options: ["180°", "360°", "90°", "270°"], answer: "180°", explanation: "The interior angles of any triangle always sum to 180 degrees." },
    { question: "Which is the smallest prime number?", options: ["2", "1", "3", "5"], answer: "2", explanation: "2 is the only even prime and the smallest prime number." },
    { question: "Convert 1.5 liters to milliliters.", options: ["1500ml", "150ml", "15000ml", "15ml"], answer: "1500ml", explanation: "1L = 1000ml, so 1.5L = 1500ml." },
    { question: "What is 12 + 4 * 3?", options: ["24", "48", "19", "36"], answer: "24", explanation: "Order of operations: 12 + (4 * 3) = 12 + 12 = 24." },
    { question: "What is the value of 2 to the power of 10?", options: ["1024", "512", "2048", "1000"], answer: "1024", explanation: "2^10 = 1024." },
    { question: "If a = 10 and b = 5, what is (a + b) / (a - b)?", options: ["3", "1", "5", "15"], answer: "3", explanation: "(10+5)/(10-5) = 15/5 = 3." },
    { question: "Find the average of 12, 18, and 30.", options: ["20", "15", "25", "18"], answer: "20", explanation: "(12+18+30)/3 = 60/3 = 20." }
  ],
  "Junior Secondary / Middle School": [
    { question: "Solve for x: x^2 - 5x + 6 = 0.", options: ["x=2, 3", "x=1, 6", "x=-2, -3", "x=5, 6"], answer: "x=2, 3", explanation: "Factors of 6 that sum to -5 are -2 and -3. (x-2)(x-3)=0." },
    { question: "What is the area of a circle with a diameter of 14 units? (π ≈ 22/7)", options: ["154", "44", "616", "49"], answer: "154", explanation: "Radius = 7. Area = πr^2 = (22/7) * 49 = 154." },
    { question: "Simplify: (2^3 * 2^4) / 2^5", options: ["4", "8", "2", "16"], answer: "4", explanation: "2^(3+4-5) = 2^2 = 4." },
    { question: "What is the gradient (slope) of the line y = 3x - 5?", options: ["3", "-5", "5", "-3"], answer: "3", explanation: "In y = mx + c, m is the gradient." },
    { question: "What is the hypotenuse of a right triangle with sides 5 and 12?", options: ["13", "17", "15", "14"], answer: "13", explanation: "sqrt(5^2 + 12^2) = sqrt(25 + 144) = 13." },
    { question: "Expand: (x + 3)(x - 4)", options: ["x^2 - x - 12", "x^2 + x - 12", "x^2 - 7x - 12", "x^2 + 7x + 12"], answer: "x^2 - x - 12", explanation: "x^2 - 4x + 3x - 12 = x^2 - x - 12." },
    { question: "What is the probability of rolling a prime number on a standard die?", options: ["1/2", "1/3", "2/3", "1/6"], answer: "1/2", explanation: "Primes: 2, 3, 5. So 3/6 = 1/2." },
    { question: "Find the median of the data: 4, 7, 2, 9, 11, 5, 8", options: ["7", "8", "9", "5"], answer: "7", explanation: "Sorted: 2, 4, 5, 7, 8, 9, 11. Middle is 7." },
    { question: "Find the interior angle of a regular hexagon.", options: ["120°", "108°", "90°", "135°"], answer: "120°", explanation: "(n-2)*180/n = (4*180)/6 = 120." },
    { question: "Solve for y: 2(y - 3) = 10", options: ["8", "5", "7", "6"], answer: "8", explanation: "2y - 6 = 10 => 2y = 16 => y = 8." },
    { question: "Solve the simultaneous equations: x+y=10 and x-y=2.", options: ["x=6, y=4", "x=5, y=5", "x=7, y=3", "x=8, y=2"], answer: "x=6, y=4", explanation: "Add them: 2x=12, x=6. Then y=4." },
    { question: "A bag has 3 red and 7 blue balls. Prob of red?", options: ["3/10", "1/3", "7/10", "3/7"], answer: "3/10", explanation: "Total balls = 10. Red = 3." },
    { question: "Find the value of 5! (factorial).", options: ["120", "60", "24", "720"], answer: "120", explanation: "5*4*3*2*1 = 120." },
    { question: "If the radius of a sphere is 3cm, what is its volume? (Leave in π)", options: ["36π", "27π", "9π", "12π"], answer: "36π", explanation: "V = (4/3)πr^3 = (4/3)π(27) = 36π." },
    { question: "Find x if 2^x = 64.", options: ["6", "5", "7", "8"], answer: "6", explanation: "2*2*2*2*2*2 = 64." }
  ],
  "Senior Secondary / High School": [
    { question: "Find the derivative of f(x) = 3x^2 + 5x - 2.", options: ["6x + 5", "3x + 5", "6x", "5x^2"], answer: "6x + 5", explanation: "d/dx(3x^2) = 6x, d/dx(5x) = 5." },
    { question: "In a right triangle, if sin(θ) = 3/5, what is tan(θ)?", options: ["3/4", "4/3", "4/5", "3/5"], answer: "3/4", explanation: "Opp=3, Hyp=5, Adj=4. tan = Opp/Adj = 3/4." },
    { question: "What is the sum of the infinite geometric series: 1 + 1/2 + 1/4 + ...?", options: ["2", "1.5", "Infinity", "1.75"], answer: "2", explanation: "S = a / (1-r) = 1 / (1 - 0.5) = 2." },
    { question: "Find the value of log₁₀(1000).", options: ["3", "10", "1", "100"], answer: "3", explanation: "10^3 = 1000." },
    { question: "What is the period of the function y = sin(2x)?", options: ["π", "2π", "π/2", "4π"], answer: "π", explanation: "Period = 2π / |b| = 2π / 2 = π." },
    { question: "Calculate the discriminant of x^2 - 4x + 4 = 0.", options: ["0", "16", "8", "-16"], answer: "0", explanation: "b^2 - 4ac = 16 - 16 = 0." },
    { question: "If f(x) = e^x, what is f'(0)?", options: ["1", "0", "e", "undefined"], answer: "1", explanation: "Derivative of e^x is e^x. e^0 = 1." },
    { question: "Evaluate ∫ (3x^2) dx from 0 to 2.", options: ["8", "4", "12", "6"], answer: "8", explanation: "x^3 evaluated from 0 to 2 = 8 - 0 = 8." },
    { question: "Find the limit of (sin x) / x as x approaches 0.", options: ["1", "0", "undefined", "Infinity"], answer: "1", explanation: "Fundamental trigonometric limit." },
    { question: "Which is the vector magnitude of (3, 4)?", options: ["5", "7", "1", "25"], answer: "5", explanation: "sqrt(3^2 + 4^2) = 5." },
    { question: "If log x + log 2 = log 10, find x.", options: ["5", "8", "12", "20"], answer: "5", explanation: "log(2x) = log(10) => 2x = 10 => x = 5." },
    { question: "Find the 10th term of AP: 5, 12, 19...", options: ["68", "75", "61", "82"], answer: "68", explanation: "a + (n-1)d = 5 + 9(7) = 5 + 63 = 68." },
    { question: "A circle has equation x^2 + y^2 = 25. What is its radius?", options: ["5", "25", "10", "sqrt(5)"], answer: "5", explanation: "r^2 = 25, so r = 5." },
    { question: "What is cos(60°)?", options: ["1/2", "sqrt(3)/2", "1", "0"], answer: "1/2", explanation: "Standard trigonometric value." },
    { question: "Find the value of 0! (zero factorial).", options: ["1", "0", "undefined", "Infinity"], answer: "1", explanation: "By definition, 0! = 1." }
  ],
  "University / Elite Professional": [
    { question: "Evaluate the integral: ∫ (2x) dx from 0 to 3.", options: ["9", "6", "3", "12"], answer: "9", explanation: "x^2 from 0 to 3 = 9." },
    { question: "What is the value of i^2 in complex numbers?", options: ["-1", "1", "i", "0"], answer: "-1", explanation: "Definition of imaginary unit." },
    { question: "If Matrix A is [[1, 2], [3, 4]], what is its determinant?", options: ["-2", "2", "10", "1"], answer: "-2", explanation: "(1*4) - (2*3) = -2." },
    { question: "Solve the differential equation dy/dx = y.", options: ["y = Ce^x", "y = x + C", "y = x^2/2", "y = sin x"], answer: "y = Ce^x", explanation: "Standard first-order linear ODE." },
    { question: "What is the rank of a 3x3 identity matrix?", options: ["3", "1", "0", "2"], answer: "3", explanation: "Identity matrices are full rank." },
    { question: "Find the gradient of f(x,y) = x^2 + y^2 at (1, 1).", options: ["(2, 2)", "(1, 1)", "(2, 0)", "(0, 2)"], answer: "(2, 2)", explanation: "df/dx = 2x, df/dy = 2y." },
    { question: "What is the Taylor series of sin(x) centered at 0 (first term)?", options: ["x", "1", "x^2", "-x"], answer: "x", explanation: "Sine expansion starts with x." },
    { question: "Evaluate the limit of (1 + 1/n)^n as n → ∞.", options: ["e", "1", "Infinity", "0"], answer: "e", explanation: "Definition of Euler's number." },
    { question: "Find the residue of 1/z at z=0.", options: ["1", "0", "2πi", "undefined"], answer: "1", explanation: "Residue at simple pole." },
    { question: "Fourier Transform of δ(t)?", options: ["1", "e^jwt", "0", "delta(w)"], answer: "1", explanation: "Transform of an impulse is constant." },
    { question: "What is the dimension of the nullspace of a full-rank nxn matrix?", options: ["0", "n", "1", "n-1"], answer: "0", explanation: "Full rank implies trivial nullspace." },
    { question: "Find the eigenvalue of [[4, 0], [0, 5]].", options: ["4 and 5", "0 and 9", "1 and 1", "20 and 0"], answer: "4 and 5", explanation: "Diagonal entries are eigenvalues." },
    { question: "What is the Laplace Transform of 1?", options: ["1/s", "s", "1", "e^-s"], answer: "1/s", explanation: "Standard Laplace table entry." },
    { question: "Cauchy-Riemann equations are used to test what?", options: ["Analyticity", "Integrability", "Continuity", "Convexity"], answer: "Analyticity", explanation: "Used in complex analysis for differentiability." },
    { question: "State of maximum entropy in a closed system is related to?", options: ["Equilibrium", "Chaos", "Work", "Enthalpy"], answer: "Equilibrium", explanation: "Second law of thermodynamics." }
  ]
};

export const SPELLING_BANK: Record<string, BankQuestion[]> = {
  "Primary / Junior School": [
    { question: "Spell the word for a place where books are kept.", answer: "Library", hint: "Place of reading", explanation: "L-I-B-R-A-R-Y" },
    { question: "Spell the word for the sound a large bell makes.", answer: "Chime", hint: "Bell sound", explanation: "C-H-I-M-E" },
    { question: "Spell the word for the person who lives next door.", answer: "Neighbor", hint: "Next-door person", explanation: "N-E-I-G-H-B-O-R" },
    { question: "Spell the word for the meal you eat in the morning.", answer: "Breakfast", hint: "Morning meal", explanation: "B-R-E-A-K-F-A-S-T" },
    { question: "Spell the word for the planet we live on.", answer: "Earth", hint: "Our home planet", explanation: "E-A-R-T-H" },
    { question: "Spell the word for a device used to capture photos.", answer: "Camera", hint: "Photo device", explanation: "C-A-M-E-R-A" },
    { question: "Spell the word meaning 'full of beauty'.", answer: "Beautiful", hint: "Very pretty", explanation: "B-E-A-U-T-I-F-U-L" },
    { question: "Spell the word for a large gray animal with a trunk.", answer: "Elephant", hint: "Large trunk animal", explanation: "E-L-E-P-H-A-N-T" },
    { question: "Spell the word for the plural of child.", answer: "Children", hint: "More than one child", explanation: "C-H-I-L-D-R-E-N" },
    { question: "Spell the word for a building where students learn.", answer: "School", hint: "Learning building", explanation: "S-C-H-O-O-L" },
    { question: "Spell the word meaning 'not difficult'.", answer: "Easy", hint: "Simple", explanation: "E-A-S-Y" },
    { question: "Spell the word for the day after Monday.", answer: "Tuesday", hint: "Second day of week", explanation: "T-U-E-S-D-A-Y" },
    { question: "Spell the word for 'a person who helps sick animals'.", answer: "Veterinarian", hint: "Animal doctor", explanation: "V-E-T-E-R-I-N-A-R-I-A-N" },
    { question: "Spell the word meaning 'the opposite of heavy'.", answer: "Light", hint: "Easy to carry", explanation: "L-I-G-H-T" },
    { question: "Spell the word for 'the yellow part of an egg'.", answer: "Yolk", hint: "Inside an egg", explanation: "Y-O-L-K" }
  ],
  "Senior Secondary / High School": [
    { question: "Spell the word meaning 'not transparent'.", answer: "Opaque", hint: "Opposite of clear", explanation: "O-P-A-Q-U-E" },
    { question: "Spell the word meaning 'occurring at the same time'.", answer: "Concurrent", hint: "Simultaneous", explanation: "C-O-N-C-U-R-R-E-N-T" },
    { question: "Spell the word meaning 'to yield or give in'.", answer: "Acquiesce", hint: "Agree silently", explanation: "A-C-Q-U-I-E-S-C-E" },
    { question: "Spell the word for 'a person who organizes a business'.", answer: "Entrepreneur", hint: "Business starter", explanation: "E-N-T-R-E-P-R-E-N-E-U-R" },
    { question: "Spell the word meaning 'existing everywhere at once'.", answer: "Ubiquitous", hint: "Everywhere", explanation: "U-B-I-Q-U-I-T-O-U-S" },
    { question: "Spell the word meaning 'to make better or improve'.", answer: "Ameliorate", hint: "Improve", explanation: "A-M-E-L-I-O-R-A-T-E" },
    { question: "Spell the word meaning 'very talkative'.", answer: "Loquacious", hint: "Wordy", explanation: "L-O-Q-U-A-C-I-O-U-S" },
    { question: "Spell the word meaning 'a subtle difference'.", answer: "Nuance", hint: "Subtle distinction", explanation: "N-U-A-N-C-E" },
    { question: "Spell the word for 'an extreme fear of small spaces'.", answer: "Claustrophobia", hint: "Fear of tight spaces", explanation: "C-L-A-U-S-T-R-O-P-H-O-B-I-A" },
    { question: "Spell the word meaning 'hard to understand; mysterious'.", answer: "Enigmatic", hint: "Like a puzzle", explanation: "E-N-I-G-M-A-T-I-C" },
    { question: "Spell the word for 'the study of the skin'.", answer: "Dermatology", hint: "Skin science", explanation: "D-E-R-M-A-T-O-L-O-G-Y" },
    { question: "Spell the word meaning 'temporary; lasting a short time'.", answer: "Ephemeral", hint: "Short-lived", explanation: "E-P-H-E-M-E-R-A-L" },
    { question: "Spell the word meaning 'a person who is or claims to be all-knowing'.", answer: "Omniscient", hint: "All-knowing", explanation: "O-M-N-I-S-C-I-E-N-T" },
    { question: "Spell the word for 'the liquid parts of blood'.", answer: "Plasma", hint: "Blood component", explanation: "P-L-A-S-M-A" },
    { question: "Spell the word meaning 'to clear from blame'.", answer: "Exonerate", hint: "Clear charge", explanation: "E-X-O-N-E-R-A-T-E" }
  ],
  "University / Elite Professional": [
    { question: "Spell the word meaning 'characterized by long words'.", answer: "Sesquipedalian", hint: "Uses long words", explanation: "S-E-S-Q-U-I-P-E-D-A-L-I-A-N" },
    { question: "Spell the word for 'a fantastic sequence of associational imagery'.", answer: "Phantasmagoria", hint: "Dream-like", explanation: "P-H-A-N-T-A-S-M-A-G-O-R-I-A" },
    { question: "Spell the word meaning 'stubbornly refusing to change'.", answer: "Obdurate", hint: "Stubborn", explanation: "O-B-D-U-R-A-T-E" },
    { question: "Spell the word for 'the tendency to find pleasant things by chance'.", answer: "Serendipity", hint: "Lucky discovery", explanation: "S-E-R-E-N-D-I-P-I-T-Y" },
    { question: "Spell the word meaning 'marked by extreme calmness'.", answer: "Equanimity", hint: "Composure", explanation: "E-Q-U-A-N-I-M-I-T-Y" },
    { question: "Spell the word for 'the state of being very ancient'.", answer: "Antiquity", hint: "Ancient times", explanation: "A-N-T-I-Q-U-I-T-Y" },
    { question: "Spell the word meaning 'to treatment with superiority'.", answer: "Patronize", hint: "Condescending", explanation: "P-A-T-R-O-N-I-Z-E" },
    { question: "Spell the word for 'a bridge between two groups'.", answer: "Liaison", hint: "Bridge person", explanation: "L-I-A-I-S-O-N" },
    { question: "Spell the word for 'the study of word origins'.", answer: "Etymology", hint: "Word science", explanation: "E-T-Y-M-O-L-O-G-Y" },
    { question: "Spell the word meaning 'lacking in consistency or order'.", answer: "Desultory", hint: "Haphazard", explanation: "D-E-S-U-L-T-O-R-Y" },
    { question: "Spell the word meaning 'excessively talkative'.", answer: "Garrulous", hint: "Talkative", explanation: "G-A-R-R-U-L-O-U-S" },
    { question: "Spell the word for 'a person who organizes and runs a government'.", answer: "Bureaucrat", hint: "Office official", explanation: "B-U-R-E-A-U-C-R-A-T" },
    { question: "Spell the word meaning 'the state of being very old'.", answer: "Senescence", hint: "Aging process", explanation: "S-E-N-E-S-C-E-N-C-E" },
    { question: "Spell the word meaning 'a short-lived fascination'.", answer: "Infatuation", hint: "Short crush", explanation: "I-N-F-A-T-U-A-T-I-O-N" },
    { question: "Spell the word meaning 'the quality of being fleeting'.", answer: "Evanescence", hint: "Vanishing", explanation: "E-V-A-N-E-S-C-E-N-C-E" }
  ]
};
