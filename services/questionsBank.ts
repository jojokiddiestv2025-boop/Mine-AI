
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
    { question: "If a train travels 120km in 2 hours, what is its speed in m/s?", options: ["16.67", "60", "33.33", "20"], answer: "16.67", explanation: "120km/2h = 60km/h. To convert to m/s: 60 * (1000/3600) = 16.67 m/s." },
    { question: "Find the value of x: 3x - 7 = 14.", options: ["7", "6", "8", "21"], answer: "7", explanation: "3x = 21, so x = 7." },
    { question: "What is 15% of 200?", options: ["20", "30", "45", "15"], answer: "30", explanation: "0.15 * 200 = 30." },
    { question: "A rectangle has a length of 8cm and a width of 5cm. What is its perimeter?", options: ["26cm", "40cm", "13cm", "20cm"], answer: "26cm", explanation: "Perimeter = 2(l + w) = 2(8 + 5) = 26cm." },
    { question: "What is 3/4 of 100?", options: ["75", "50", "25", "80"], answer: "75", explanation: "(3/4) * 100 = 75." },
    { question: "Solve: 12 + 4 * 3 - 2", options: ["22", "46", "38", "14"], answer: "22", explanation: "PEMDAS: 4 * 3 = 12. 12 + 12 - 2 = 22." },
    { question: "How many sides does a heptagon have?", options: ["7", "6", "8", "9"], answer: "7", explanation: "A heptagon is a 7-sided polygon." },
    { question: "If 5 pencils cost $2.50, how much do 12 pencils cost?", options: ["$6.00", "$5.50", "$7.00", "$6.50"], answer: "$6.00", explanation: "Cost per pencil = $2.50 / 5 = $0.50. 12 * $0.50 = $6.00." },
    { question: "What is the value of 5 cubed?", options: ["125", "25", "15", "75"], answer: "125", explanation: "5 * 5 * 5 = 125." },
    { question: "What is the next number in the sequence: 2, 4, 8, 16, ...?", options: ["32", "24", "20", "30"], answer: "32", explanation: "The sequence doubles each time." },
    { question: "Convert 1.5 liters to milliliters.", options: ["1500ml", "150ml", "15000ml", "15ml"], answer: "1500ml", explanation: "1L = 1000ml, so 1.5L = 1500ml." },
    { question: "What is the sum of angles in a triangle?", options: ["180°", "360°", "90°", "270°"], answer: "180°", explanation: "The interior angles of any triangle always sum to 180 degrees." },
    { question: "Which is the smallest prime number?", options: ["2", "1", "3", "5"], answer: "2", explanation: "2 is the only even prime and the smallest prime number." },
    { question: "If a car travels 45 miles per hour, how far will it travel in 3 hours?", options: ["135 miles", "120 miles", "150 miles", "90 miles"], answer: "135 miles", explanation: "Distance = Speed * Time = 45 * 3 = 135." }
  ],
  "Junior Secondary / Middle School": [
    { question: "Solve for x: x^2 - 5x + 6 = 0.", options: ["x=2, 3", "x=1, 6", "x=-2, -3", "x=5, 6"], answer: "x=2, 3", explanation: "Factors of 6 that sum to -5 are -2 and -3. (x-2)(x-3)=0." },
    { question: "What is the area of a circle with a diameter of 14 units? (Use π ≈ 22/7)", options: ["154", "44", "616", "49"], answer: "154", explanation: "Radius = 7. Area = πr^2 = (22/7) * 7 * 7 = 154." },
    { question: "Simplify: (2^3 * 2^4) / 2^5", options: ["4", "8", "2", "16"], answer: "4", explanation: "2^(3+4-5) = 2^2 = 4." },
    { question: "What is the gradient (slope) of the line y = 3x - 5?", options: ["3", "-5", "5", "-3"], answer: "3", explanation: "In y = mx + c, m is the gradient." },
    { question: "If a = 5 and b = -2, find the value of 2a + 3b.", options: ["4", "16", "1", "7"], answer: "4", explanation: "2(5) + 3(-2) = 10 - 6 = 4." },
    { question: "What is the hypotenuse of a right triangle with sides 5 and 12?", options: ["13", "17", "15", "14"], answer: "13", explanation: "sqrt(5^2 + 12^2) = sqrt(25 + 144) = sqrt(169) = 13." },
    { question: "Expand: (x + 3)(x - 4)", options: ["x^2 - x - 12", "x^2 + x - 12", "x^2 - 7x - 12", "x^2 + 7x + 12"], answer: "x^2 - x - 12", explanation: "x*x - 4x + 3x - 12 = x^2 - x - 12." },
    { question: "What is the probability of rolling a prime number on a standard die?", options: ["1/2", "1/3", "2/3", "1/6"], answer: "1/2", explanation: "Prime numbers on a die: 2, 3, 5. So 3/6 = 1/2." },
    { question: "Find the median of the data: 4, 7, 2, 9, 11, 5, 8", options: ["7", "8", "9", "5"], answer: "7", explanation: "Ordered: 2, 4, 5, 7, 8, 9, 11. Middle value is 7." },
    { question: "Solve for y: 2(y - 3) = 10", options: ["8", "5", "7", "6"], answer: "8", explanation: "2y - 6 = 10 => 2y = 16 => y = 8." },
    { question: "A cylinder has a radius of 3cm and height of 7cm. Volume? (π=22/7)", options: ["198cm³", "132cm³", "66cm³", "154cm³"], answer: "198cm³", explanation: "V = πr²h = (22/7) * 9 * 7 = 198." },
    { question: "Convert 60% to a simplified fraction.", options: ["3/5", "2/3", "3/4", "1/2"], answer: "3/5", explanation: "60/100 = 6/10 = 3/5." },
    { question: "Find the interior angle of a regular hexagon.", options: ["120°", "108°", "90°", "135°"], answer: "120°", explanation: "(n-2)*180/n = (4*180)/6 = 120." },
    { question: "What is the square of 25?", options: ["625", "525", "225", "125"], answer: "625", explanation: "25 * 25 = 625." },
    { question: "If 3x + 4 = 19, find x.", options: ["5", "4", "6", "7"], answer: "5", explanation: "3x = 15, so x = 5." }
  ],
  "Senior Secondary / High School": [
    { question: "Find the derivative of f(x) = 3x^2 + 5x - 2.", options: ["6x + 5", "3x + 5", "6x", "5x^2"], answer: "6x + 5", explanation: "Using power rule: d/dx(3x^2) = 6x, d/dx(5x) = 5." },
    { question: "In a right-angled triangle, if sin(θ) = 3/5, what is tan(θ)?", options: ["3/4", "4/3", "4/5", "3/5"], answer: "3/4", explanation: "Opposite=3, Hypotenuse=5. Adjacent = sqrt(5^2 - 3^2) = 4. tan = Opp/Adj = 3/4." },
    { question: "What is the sum of the infinite geometric series: 1 + 1/2 + 1/4 + ...?", options: ["2", "1.5", "Infinity", "1.75"], answer: "2", explanation: "Sum = a / (1-r) = 1 / (1 - 0.5) = 2." },
    { question: "Find the value of log₁₀(1000).", options: ["3", "10", "1", "100"], answer: "3", explanation: "10^3 = 1000." },
    { question: "What is the period of the function y = sin(2x)?", options: ["π", "2π", "π/2", "4π"], answer: "π", explanation: "Period = 2π / |b| = 2π / 2 = π." },
    { question: "Calculate the discriminant of x^2 - 4x + 4 = 0.", options: ["0", "16", "8", "-16"], answer: "0", explanation: "b^2 - 4ac = (-4)^2 - 4(1)(4) = 16 - 16 = 0." },
    { question: "If f(x) = e^x, what is f'(0)?", options: ["1", "0", "e", "undefined"], answer: "1", explanation: "Derivative of e^x is e^x. e^0 = 1." },
    { question: "Find the center of the circle x^2 + y^2 - 4x + 6y - 3 = 0.", options: ["(2, -3)", "(-2, 3)", "(4, -6)", "(0, 0)"], answer: "(2, -3)", explanation: "Complete the square: (x-2)^2 + (y+3)^2 = 16." },
    { question: "A bag has 3 red and 5 blue balls. Prob of picking 2 red (without replacement)?", options: ["3/28", "9/64", "6/56", "1/4"], answer: "3/28", explanation: "(3/8) * (2/7) = 6/56 = 3/28." },
    { question: "What is the limit of (sin x) / x as x approaches 0?", options: ["1", "0", "undefined", "Infinity"], answer: "1", explanation: "This is a fundamental limit in calculus." },
    { question: "Solve for x: 2^(x+1) = 32", options: ["4", "5", "6", "3"], answer: "4", explanation: "32 = 2^5, so x+1 = 5, x = 4." },
    { question: "What is the vector magnitude of (3, 4)?", options: ["5", "7", "1", "25"], answer: "5", explanation: "sqrt(3^2 + 4^2) = 5." },
    { question: "Find the inverse of f(x) = 2x + 1.", options: ["(x-1)/2", "2x - 1", "x/2 - 1", "1/2x + 1"], answer: "(x-1)/2", explanation: "y = 2x + 1 => x = (y-1)/2." },
    { question: "Sum of first 10 terms of AP: 2, 5, 8...?", options: ["155", "145", "160", "150"], answer: "155", explanation: "S = n/2 [2a + (n-1)d] = 5 [4 + 27] = 155." },
    { question: "What is the slope of the tangent to y = x^3 at x = 2?", options: ["12", "8", "6", "4"], answer: "12", explanation: "y' = 3x^2. 3(2)^2 = 12." }
  ],
  "University / Elite Professional": [
    { question: "Evaluate the integral: ∫ (2x) dx from 0 to 3.", options: ["9", "6", "3", "12"], answer: "9", explanation: "Integral of 2x is x^2. Evaluate from 0 to 3: 3^2 - 0^2 = 9." },
    { question: "What is the value of i^2 in complex numbers?", options: ["-1", "1", "i", "0"], answer: "-1", explanation: "By definition, the imaginary unit i satisfies i^2 = -1." },
    { question: "If Matrix A is [[1, 2], [3, 4]], what is its determinant?", options: ["-2", "2", "10", "1"], answer: "-2", explanation: "Det = (1*4) - (2*3) = 4 - 6 = -2." },
    { question: "Solve the differential equation dy/dx = y.", options: ["y = Ce^x", "y = x + C", "y = x^2/2", "y = sin x"], answer: "y = Ce^x", explanation: "The exponential function is its own derivative." },
    { question: "What is the rank of a 3x3 identity matrix?", options: ["3", "1", "0", "2"], answer: "3", explanation: "An identity matrix is full rank." },
    { question: "Find the gradient of f(x,y) = x^2 + y^2 at (1, 1).", options: ["(2, 2)", "(1, 1)", "(2, 0)", "(0, 2)"], answer: "(2, 2)", explanation: "Partial derivatives: df/dx = 2x, df/dy = 2y. At (1,1), it is (2,2)." },
    { question: "What is the Taylor series of sin(x) centered at 0 (first 2 terms)?", options: ["x - x³/6", "x + x³/6", "1 - x²/2", "x"], answer: "x - x³/6", explanation: "Standard Taylor expansion for sine." },
    { question: "Evaluate the limit of (1 + 1/n)^n as n approaches infinity.", options: ["e", "1", "Infinity", "0"], answer: "e", explanation: "This is one of the definitions of Euler's number e." },
    { question: "If A and B are independent events, P(A)=0.5, P(B)=0.4, P(A ∩ B)?", options: ["0.2", "0.9", "0.1", "0.25"], answer: "0.2", explanation: "P(A ∩ B) = P(A) * P(B) = 0.5 * 0.4 = 0.2." },
    { question: "What is the eigenvalue of the matrix [[2, 0], [0, 3]]?", options: ["2 and 3", "0 and 5", "1 and 1", "6 and 0"], answer: "2 and 3", explanation: "For diagonal matrices, eigenvalues are the diagonal entries." },
    { question: "Which theorem relates surface integrals to volume integrals?", options: ["Divergence Theorem", "Stokes' Theorem", "Green's Theorem", "Taylor's Theorem"], answer: "Divergence Theorem", explanation: "Also known as Gauss's Theorem." },
    { question: "What is the complex conjugate of 3 + 4i?", options: ["3 - 4i", "-3 + 4i", "-3 - 4i", "4 + 3i"], answer: "3 - 4i", explanation: "Change the sign of the imaginary part." },
    { question: "Find the residue of 1/z at z=0.", options: ["1", "0", "2πi", "undefined"], answer: "1", explanation: "The coefficient of 1/z term in Laurent series." },
    { question: "Calculate 5! (factorial).", options: ["120", "60", "24", "720"], answer: "120", explanation: "5 * 4 * 3 * 2 * 1 = 120." },
    { question: "What is the Fourier Transform of a Dirac delta function δ(t)?", options: ["1", "e^jwt", "0", "delta(w)"], answer: "1", explanation: "The Fourier transform of an impulse is constant across all frequencies." }
  ]
};

export const SPELLING_BANK: Record<string, BankQuestion[]> = {
  "Primary / Junior School": [
    { question: "How do you spell the word for a place where books are kept?", answer: "Library", hint: "Place of reading", explanation: "L-I-B-R-A-R-Y" },
    { question: "Spell the word for the sound a large bell makes.", answer: "Chime", hint: "Bell sound", explanation: "C-H-I-M-E" },
    { question: "Spell the word for the person who lives next door.", answer: "Neighbor", hint: "Next-door person", explanation: "N-E-I-G-H-B-O-R" },
    { question: "Spell the word for the first month of the year.", answer: "January", hint: "First month", explanation: "J-A-N-U-A-R-Y" },
    { question: "Spell the word for a device used to capture photos.", answer: "Camera", hint: "Photo device", explanation: "C-A-M-E-R-A" },
    { question: "Spell the word meaning 'full of beauty'.", answer: "Beautiful", hint: "Very pretty", explanation: "B-E-A-U-T-I-F-U-L" },
    { question: "Spell the word for a large gray animal with a trunk.", answer: "Elephant", hint: "Large trunk animal", explanation: "E-L-E-P-H-A-N-T" },
    { question: "Spell the word for the planet we live on.", answer: "Earth", hint: "Our home planet", explanation: "E-A-R-T-H" },
    { question: "Spell the word for the meal you eat in the morning.", answer: "Breakfast", hint: "Morning meal", explanation: "B-R-E-A-K-F-A-S-T" },
    { question: "Spell the word for a building where students learn.", answer: "School", hint: "Learning building", explanation: "S-C-H-O-O-L" },
    { question: "Spell the word for the plural of child.", answer: "Children", hint: "More than one child", explanation: "C-H-I-L-D-R-E-N" },
    { question: "Spell the word meaning 'not difficult'.", answer: "Easy", hint: "Simple", explanation: "E-A-S-Y" },
    { question: "Spell the word for the day after Monday.", answer: "Tuesday", hint: "Second day of the week", explanation: "T-U-E-S-D-A-Y" },
    { question: "Spell the word for a fruit that is typically red or green.", answer: "Apple", hint: "Common fruit", explanation: "A-P-P-L-E" },
    { question: "Spell the word meaning 'to feel happy'.", answer: "Cheerful", hint: "Full of cheer", explanation: "C-H-E-E-R-F-U-L" }
  ],
  "Senior Secondary / High School": [
    { question: "Spell the word meaning 'not able to be seen through; not transparent'.", answer: "Opaque", hint: "Opposite of transparent", explanation: "O-P-A-Q-U-E" },
    { question: "Spell the word for a collection of wild animals kept in captivity for exhibition.", answer: "Menagerie", hint: "Captive animal collection", explanation: "M-E-N-A-G-E-R-I-E" },
    { question: "Spell the word meaning 'occurring at the same time; simultaneous'.", answer: "Concurrent", hint: "At the same time", explanation: "C-O-N-C-U-R-R-E-N-T" },
    { question: "Spell the word meaning 'to yield or give in to a request'.", answer: "Acquiesce", hint: "To agree silently", explanation: "A-C-Q-U-I-E-S-C-E" },
    { question: "Spell the word for a person who organizes and operates a business.", answer: "Entrepreneur", hint: "Business starter", explanation: "E-N-T-R-E-P-R-E-N-E-U-R" },
    { question: "Spell the word meaning 'wishing to do what is right'.", answer: "Conscientious", hint: "Diligent and moral", explanation: "C-O-N-S-C-I-E-N-T-I-O-U-S" },
    { question: "Spell the word meaning 'a temporary stay'.", answer: "Sojourn", hint: "Short visit", explanation: "S-O-J-O-U-R-N" },
    { question: "Spell the word meaning 'a subtle difference'.", answer: "Nuance", hint: "Subtle distinction", explanation: "N-U-A-N-C-E" },
    { question: "Spell the word meaning 'very talkative'.", answer: "Loquacious", hint: "Wordy", explanation: "L-O-Q-U-A-C-I-O-U-S" },
    { question: "Spell the word for 'a person who hates or avoids people'.", answer: "Misanthrope", hint: "People-hater", explanation: "M-I-S-A-N-T-H-R-O-P-E" },
    { question: "Spell the word meaning 'existing everywhere at once'.", answer: "Ubiquitous", hint: "Everywhere", explanation: "U-B-I-Q-U-I-T-O-U-S" },
    { question: "Spell the word meaning 'to make better or improve'.", answer: "Ameliorate", hint: "Improve", explanation: "A-M-E-L-I-O-R-A-T-E" },
    { question: "Spell the word for 'an short, pithy statement expressing a general truth'.", answer: "Aphorism", hint: "Truthful saying", explanation: "A-P-H-O-R-I-S-M" },
    { question: "Spell the word meaning 'to clear from blame'.", answer: "Exonerate", hint: "Clear from charge", explanation: "E-X-O-N-E-R-A-T-E" },
    { question: "Spell the word meaning 'showing a lack of proper respect'.", answer: "Irreverent", hint: "Disrespectful", explanation: "I-R-R-E-V-E-R-E-N-T" }
  ],
  "University / Elite Professional": [
    { question: "Spell the word for 'the study of the origin of words'.", answer: "Etymology", hint: "Word origins", explanation: "E-T-Y-M-O-L-O-G-Y" },
    { question: "Spell the word meaning 'excessively talkative, especially on trivial matters'.", answer: "Garrulous", hint: "Very talkative", explanation: "G-A-R-R-U-L-O-U-S" },
    { question: "Spell the word for 'a slight or subtle degree of difference, as in meaning or color'.", answer: "Nuance", hint: "Subtle difference", explanation: "N-U-A-N-C-E" },
    { question: "Spell the word meaning 'characterized by long words'.", answer: "Sesquipedalian", hint: "Uses long words", explanation: "S-E-S-Q-U-I-P-E-D-A-L-I-A-N" },
    { question: "Spell the word for 'a fantastic sequence of haphazardly associative imagery'.", answer: "Phantasmagoria", hint: "Dream-like sequence", explanation: "P-H-A-N-T-A-S-M-A-G-O-R-I-A" },
    { question: "Spell the word meaning 'stubbornly refusing to change one's opinion'.", answer: "Obdurate", hint: "Stubborn", explanation: "O-B-D-U-R-A-T-E" },
    { question: "Spell the word for 'the quality of being fleeting or vanishing quickly'.", answer: "Evanescence", hint: "Vanishing", explanation: "E-V-A-N-E-S-C-E-N-C-E" },
    { question: "Spell the word meaning 'to treat with apparent kindness that betrays a feeling of superiority'.", answer: "Patronize", hint: "Condescending kindness", explanation: "P-A-T-R-O-N-I-Z-E" },
    { question: "Spell the word meaning 'a person who is or claims to be all-knowing'.", answer: "Pantisocracy", hint: "Utopian social organization", explanation: "P-A-N-T-I-S-O-C-R-A-C-Y" },
    { question: "Spell the word meaning 'to pass gradually into another form'.", answer: "Transmogrify", hint: "Transform", explanation: "T-R-A-N-S-M-O-G-R-I-F-Y" },
    { question: "Spell the word meaning 'marked by extreme calmness and composure'.", answer: "Equanimity", hint: "Composure", explanation: "E-Q-U-A-N-I-M-I-T-Y" },
    { question: "Spell the word for 'the recurrence of an action after an interval'.", answer: "Intermittence", hint: "Stopping and starting", explanation: "I-N-T-E-R-M-I-T-T-E-N-C-E" },
    { question: "Spell the word meaning 'the state of being very old or ancient'.", answer: "Antiquity", hint: "Ancient times", explanation: "A-N-T-I-Q-U-I-T-Y" },
    { question: "Spell the word for 'a person who acts as a bridge between two groups'.", answer: "Liaison", hint: "Bridge person", explanation: "L-I-A-I-S-O-N" },
    { question: "Spell the word for 'the tendency to find pleasant things by chance'.", answer: "Serendipity", hint: "Lucky discovery", explanation: "S-E-R-E-N-D-I-P-I-T-Y" }
  ]
};
