export interface KeyFormula {
  name: string;
  formula: string;
  description: string;
}

export interface WorkedExample {
  problem: string;
  steps: string[];
  answer: string;
}

export interface LessonContent {
  overview: string;
  keyFormulas?: KeyFormula[];
  workedExamples?: WorkedExample[];
  keyPoints: string[];
  proTips?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'theory' | 'example' | 'practice';
  content: LessonContent;
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'College';
  description: string;
  icon: string;
  color: string;
  totalDuration: string;
  skills: string[];
  prerequisites: string[];
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: 'arithmetic',
    title: 'Arithmetic Foundations',
    subject: 'Arithmetic',
    level: 'Beginner',
    description: 'Master the building blocks of all mathematics — integers, fractions, decimals, percentages, and the rules that govern every calculation.',
    icon: 'calculator',
    color: '#4CAF50',
    totalDuration: '4 hrs 20 min',
    skills: ['Integer operations', 'Fraction arithmetic', 'Percent problems', 'Order of operations'],
    prerequisites: [],
    lessons: [
      {
        id: 'arith-1',
        title: 'Integers & the Number Line',
        duration: '14 min',
        type: 'theory',
        content: {
          overview: 'Integers are whole numbers including zero and their negatives: …−3,−2,−1,0,1,2,3…. The number line is a visual tool that places every integer in order; positive integers sit to the right of zero and negatives to the left. Understanding integer operations is the foundation of all arithmetic.',
          keyFormulas: [
            { name: 'Adding same signs', formula: '(+a) + (+b) = +(a+b)', description: 'Add the values, keep the sign' },
            { name: 'Adding opposite signs', formula: '(+a) + (−b) = a − b (keep sign of larger)', description: 'Subtract, keep the sign of the number with greater absolute value' },
            { name: 'Subtracting integers', formula: 'a − b = a + (−b)', description: 'Subtraction is adding the opposite' },
            { name: 'Multiplying / dividing signs', formula: '(+)(+)=(+)  (−)(−)=(+)  (+)(−)=(−)', description: 'Same signs → positive; opposite signs → negative' },
          ],
          workedExamples: [
            {
              problem: 'Calculate: −8 + 3 − (−5)',
              steps: [
                'Rewrite subtraction as addition of the opposite: −8 + 3 + 5',
                'Add left to right: −8 + 3 = −5',
                '−5 + 5 = 0',
              ],
              answer: '0',
            },
          ],
          keyPoints: [
            'The absolute value |a| is the distance from zero — always non-negative',
            'Adding a negative is the same as subtracting',
            'Two negatives multiplied give a positive',
            'Zero is neither positive nor negative',
          ],
          proTips: ['Draw a number line when you get confused with signs — physically moving left/right makes it concrete.'],
        },
      },
      {
        id: 'arith-2',
        title: 'Fractions',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'A fraction a/b represents a parts of a whole divided into b equal parts. Fractions can be added, subtracted, multiplied, and divided using a small set of rules. Simplifying fractions by canceling common factors is essential before performing operations.',
          keyFormulas: [
            { name: 'Addition/Subtraction', formula: 'a/b ± c/d = (ad ± bc) / bd', description: 'Find a common denominator first' },
            { name: 'Multiplication', formula: '(a/b) × (c/d) = ac / bd', description: 'Multiply numerators and denominators straight across' },
            { name: 'Division', formula: '(a/b) ÷ (c/d) = (a/b) × (d/c)', description: 'Multiply by the reciprocal of the divisor' },
            { name: 'Simplifying', formula: 'a/b = (a÷g)/(b÷g)  where g = GCD(a,b)', description: 'Divide both parts by their greatest common divisor' },
          ],
          workedExamples: [
            {
              problem: 'Compute 2/3 + 5/6',
              steps: [
                'Find LCD of 3 and 6: LCD = 6',
                'Convert 2/3 = 4/6',
                'Add: 4/6 + 5/6 = 9/6',
                'Simplify: 9/6 = 3/2 = 1½',
              ],
              answer: '3/2 (or 1½)',
            },
          ],
          keyPoints: [
            'Always simplify fractions to lowest terms',
            'A fraction equals zero only when the numerator is zero',
            'Dividing by a fraction — flip and multiply',
            'Mixed numbers: convert to improper fractions before computing',
          ],
        },
      },
      {
        id: 'arith-3',
        title: 'Decimals',
        duration: '14 min',
        type: 'theory',
        content: {
          overview: 'Decimals are another way to write fractions whose denominator is a power of 10. Each place to the right of the decimal point represents tenths, hundredths, thousandths, and so on. Decimal arithmetic follows the same rules as integer arithmetic once you line up the decimal points.',
          keyFormulas: [
            { name: 'Fraction → Decimal', formula: 'a/b: divide a by b using long division', description: 'The result may terminate or repeat' },
            { name: 'Decimal → Fraction', formula: '0.xyz = xyz / 10³ (then simplify)', description: 'Count decimal places to get denominator' },
            { name: 'Rounding', formula: 'Look at digit after target place: ≥5 round up, <5 round down', description: 'Standard rounding rule' },
          ],
          workedExamples: [
            {
              problem: 'Multiply 3.6 × 1.4',
              steps: [
                'Ignore decimals: 36 × 14 = 504',
                'Count total decimal places: 1 + 1 = 2',
                'Place decimal 2 positions from right: 5.04',
              ],
              answer: '5.04',
            },
          ],
          keyPoints: [
            'Line up decimal points when adding or subtracting',
            'Count total decimal places when multiplying',
            'Move decimal right when dividing (make divisor a whole number)',
            '1/3 = 0.333… is a repeating decimal',
          ],
        },
      },
      {
        id: 'arith-4',
        title: 'Percentages',
        duration: '16 min',
        type: 'theory',
        content: {
          overview: 'A percentage is a ratio out of 100. The word "percent" means "per hundred." Percentages are used everywhere — discounts, tax, interest, statistics. Converting between percentages, decimals, and fractions is a core skill.',
          keyFormulas: [
            { name: 'Percent ↔ Decimal', formula: 'p% = p/100 = p × 0.01', description: 'Divide by 100 to convert to decimal' },
            { name: 'Finding a percent of a number', formula: 'x% of N = (x/100) × N', description: 'Multiply N by the decimal form of x%' },
            { name: 'Percent change', formula: '% change = ((new − old) / old) × 100', description: 'Positive = increase, negative = decrease' },
            { name: 'Finding the original', formula: 'original = amount / (percent/100)', description: 'Reverse-percent problems' },
          ],
          workedExamples: [
            {
              problem: 'A jacket costs $80 and is discounted 35%. What is the sale price?',
              steps: [
                'Discount amount = 35% of 80 = 0.35 × 80 = $28',
                'Sale price = 80 − 28 = $52',
              ],
              answer: '$52',
            },
          ],
          keyPoints: [
            '100% means the whole thing; 50% is half',
            'A 20% increase followed by a 20% decrease does NOT return to the original',
            'Percentage point ≠ percent change (going from 10% to 15% is +5 percentage points but +50% relative change)',
          ],
          proTips: ['To find 15% quickly: find 10% (move decimal left), halve it for 5%, then add.'],
        },
      },
      {
        id: 'arith-5',
        title: 'Ratios & Proportions',
        duration: '15 min',
        type: 'theory',
        content: {
          overview: 'A ratio compares two quantities; a proportion states that two ratios are equal. Proportions are used to scale recipes, convert units, solve similarity problems in geometry, and much more.',
          keyFormulas: [
            { name: 'Ratio notation', formula: 'a : b  or  a/b', description: 'Both forms mean "a for every b"' },
            { name: 'Proportion', formula: 'a/b = c/d  →  ad = bc (cross-multiply)', description: 'Cross-multiplication to solve for unknowns' },
            { name: 'Unit rate', formula: 'rate = quantity / 1 unit', description: 'e.g. miles per hour, price per item' },
          ],
          workedExamples: [
            {
              problem: 'If 5 apples cost $3.50, how much do 8 apples cost?',
              steps: [
                'Set up proportion: 5/3.50 = 8/x',
                'Cross-multiply: 5x = 3.50 × 8 = 28',
                'x = 28/5 = 5.60',
              ],
              answer: '$5.60',
            },
          ],
          keyPoints: [
            'Simplify ratios just like fractions',
            'A proportion has exactly two equivalent ratios',
            'Cross-multiply only when the equation is in the form a/b = c/d',
          ],
        },
      },
      {
        id: 'arith-6',
        title: 'Order of Operations (PEMDAS)',
        duration: '12 min',
        type: 'theory',
        content: {
          overview: 'Mathematical expressions must be evaluated in a specific order to get a unique, correct answer. PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction) is the universally agreed-upon convention.',
          keyFormulas: [
            { name: 'PEMDAS order', formula: 'P → E → M/D (left to right) → A/S (left to right)', description: 'Strictly follow this sequence' },
          ],
          workedExamples: [
            {
              problem: 'Evaluate: 3 + 6 × (5 + 4) ÷ 3 − 7',
              steps: [
                'Parentheses: 5 + 4 = 9  →  3 + 6 × 9 ÷ 3 − 7',
                'Multiply/Divide left-to-right: 6 × 9 = 54  →  3 + 54 ÷ 3 − 7',
                '54 ÷ 3 = 18  →  3 + 18 − 7',
                'Add/Subtract left-to-right: 3 + 18 = 21  →  21 − 7 = 14',
              ],
              answer: '14',
            },
          ],
          keyPoints: [
            'Multiplication and Division have equal priority — work left to right',
            'Addition and Subtraction have equal priority — work left to right',
            'Nested parentheses: solve innermost first',
          ],
          proTips: ['"Please Excuse My Dear Aunt Sally" — a classic mnemonic for PEMDAS.'],
        },
      },
      {
        id: 'arith-7',
        title: 'Factors & Multiples',
        duration: '16 min',
        type: 'theory',
        content: {
          overview: 'A factor of n divides n evenly with no remainder. A multiple of n is any product n×k. Finding greatest common divisors (GCD) and least common multiples (LCM) is essential for fraction arithmetic and solving equations.',
          keyFormulas: [
            { name: 'GCD (Euclidean algorithm)', formula: 'GCD(a,b) = GCD(b, a mod b)  until remainder = 0', description: 'Efficient method for large numbers' },
            { name: 'LCM from GCD', formula: 'LCM(a,b) = (a × b) / GCD(a,b)', description: 'Quick formula once GCD is known' },
          ],
          workedExamples: [
            {
              problem: 'Find GCD(48, 18) and LCM(48, 18)',
              steps: [
                'GCD: 48 = 2×18 + 12  →  GCD(48,18) = GCD(18,12)',
                '18 = 1×12 + 6  →  GCD(18,12) = GCD(12,6)',
                '12 = 2×6 + 0  →  GCD = 6',
                'LCM = (48 × 18) / 6 = 864 / 6 = 144',
              ],
              answer: 'GCD = 6, LCM = 144',
            },
          ],
          keyPoints: [
            'Every positive integer is a factor of itself and of 0',
            'GCD × LCM = a × b for any two positive integers a, b',
            'A prime number has exactly two factors: 1 and itself',
          ],
        },
      },
      {
        id: 'arith-8',
        title: 'Absolute Value & Opposites',
        duration: '10 min',
        type: 'theory',
        content: {
          overview: 'The absolute value of a number is its distance from zero on the number line, always non-negative. Absolute value equations and inequalities have two cases — positive and negative — and appear throughout algebra and calculus.',
          keyFormulas: [
            { name: 'Definition', formula: '|a| = a if a ≥ 0;  |a| = −a if a < 0', description: 'Distance from zero' },
            { name: 'Absolute value equation', formula: '|x| = k  →  x = k  or  x = −k  (k ≥ 0)', description: 'Two solutions when k > 0' },
            { name: 'Triangle inequality', formula: '|a + b| ≤ |a| + |b|', description: 'Fundamental inequality in math and physics' },
          ],
          workedExamples: [
            {
              problem: 'Solve |2x − 3| = 7',
              steps: [
                'Case 1: 2x − 3 = 7  →  2x = 10  →  x = 5',
                'Case 2: 2x − 3 = −7  →  2x = −4  →  x = −2',
              ],
              answer: 'x = 5  or  x = −2',
            },
          ],
          keyPoints: [
            '|a| ≥ 0 always; |a| = 0 only when a = 0',
            '|ab| = |a| × |b|',
            'Absolute value removes the sign — never introduce false solutions without checking',
          ],
        },
      },
    ],
  },

  {
    id: 'algebra1',
    title: 'Algebra I',
    subject: 'Algebra',
    level: 'Beginner',
    description: 'Develop fluency with linear equations, graphing, systems, polynomials, and the quadratic formula — the core toolkit of high-school mathematics.',
    icon: 'calculator-outline',
    color: '#6C63FF',
    totalDuration: '6 hrs 10 min',
    skills: ['Linear equations', 'Graphing lines', 'Systems of equations', 'Factoring', 'Quadratic equations'],
    prerequisites: ['Pre-Algebra'],
    lessons: [
      {
        id: 'alg1-1',
        title: 'Linear Equations in One Variable',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'A linear equation in one variable is any equation of the form ax + b = c. Solving means isolating x using inverse operations: addition/subtraction and multiplication/division. The goal is to get x alone on one side.',
          keyFormulas: [
            { name: 'Standard form', formula: 'ax + b = c', description: 'a, b, c are constants; a ≠ 0' },
            { name: 'Solution', formula: 'x = (c − b) / a', description: 'Subtract b, then divide by a' },
          ],
          workedExamples: [
            {
              problem: 'Solve 5x − 8 = 2x + 7',
              steps: [
                'Move x-terms left: 5x − 2x = 7 + 8',
                '3x = 15',
                'x = 5',
                'Check: 5(5)−8 = 17  and  2(5)+7 = 17 ✓',
              ],
              answer: 'x = 5',
            },
          ],
          keyPoints: [
            'Whatever you do to one side, do to the other',
            'Combining like terms before isolating x simplifies work',
            'Always check your answer by substituting back',
          ],
        },
      },
      {
        id: 'alg1-2',
        title: 'Slope & Intercepts',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'Slope measures the steepness of a line — rise over run. The y-intercept is where the line crosses the y-axis. Together, slope and y-intercept completely describe any non-vertical line.',
          keyFormulas: [
            { name: 'Slope', formula: 'm = (y₂ − y₁) / (x₂ − x₁)', description: 'Change in y divided by change in x between two points' },
            { name: 'Slope-intercept form', formula: 'y = mx + b', description: 'm = slope, b = y-intercept' },
            { name: 'Point-slope form', formula: 'y − y₁ = m(x − x₁)', description: 'Useful when slope and a point are known' },
          ],
          workedExamples: [
            {
              problem: 'Find the equation of the line through (2, 5) and (6, 13)',
              steps: [
                'm = (13−5)/(6−2) = 8/4 = 2',
                'Use point-slope: y − 5 = 2(x − 2)',
                'y − 5 = 2x − 4',
                'y = 2x + 1',
              ],
              answer: 'y = 2x + 1',
            },
          ],
          keyPoints: [
            'Horizontal lines have slope 0; vertical lines have undefined slope',
            'Parallel lines have equal slopes',
            'Perpendicular lines have slopes that are negative reciprocals: m₁ × m₂ = −1',
          ],
        },
      },
      {
        id: 'alg1-3',
        title: 'Systems of Equations — Substitution',
        duration: '22 min',
        type: 'example',
        content: {
          overview: 'A system of two linear equations has one solution (intersection point), no solution (parallel lines), or infinitely many solutions (same line). The substitution method solves one equation for a variable, then substitutes into the other.',
          keyFormulas: [
            { name: 'Substitution steps', formula: '1) Solve eq1 for x  2) Substitute into eq2  3) Solve for y  4) Back-substitute', description: 'Standard four-step process' },
          ],
          workedExamples: [
            {
              problem: 'Solve the system:  y = 2x + 1  and  3x + y = 16',
              steps: [
                'Substitute y = 2x+1 into 3x + y = 16',
                '3x + (2x+1) = 16  →  5x + 1 = 16',
                '5x = 15  →  x = 3',
                'y = 2(3)+1 = 7',
              ],
              answer: '(x, y) = (3, 7)',
            },
          ],
          keyPoints: [
            'Substitution works best when a variable is already isolated',
            'Check the solution in BOTH original equations',
            'If you get 0=0, the system has infinite solutions (same line)',
            'If you get 0=5, the system has no solution (parallel lines)',
          ],
        },
      },
      {
        id: 'alg1-4',
        title: 'Systems of Equations — Elimination',
        duration: '20 min',
        type: 'example',
        content: {
          overview: 'The elimination (addition) method adds or subtracts the equations to cancel one variable. Multiplying equations by constants first lets you align coefficients for elimination.',
          workedExamples: [
            {
              problem: 'Solve: 3x + 2y = 12  and  5x − 2y = 4',
              steps: [
                'y-coefficients are +2 and −2 — add the equations',
                '(3x+2y) + (5x−2y) = 12 + 4  →  8x = 16',
                'x = 2',
                'Substitute: 3(2)+2y = 12  →  6+2y=12  →  y=3',
              ],
              answer: '(x, y) = (2, 3)',
            },
          ],
          keyPoints: [
            'Choose the variable that is easier to eliminate',
            'Multiply one or both equations so coefficients become opposites',
            'Elimination and substitution always give the same answer',
          ],
        },
      },
      {
        id: 'alg1-5',
        title: 'Polynomials & FOIL',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'A polynomial is a sum of terms of the form axⁿ. Adding and subtracting polynomials means combining like terms. Multiplying two binomials uses the FOIL method: First, Outer, Inner, Last.',
          keyFormulas: [
            { name: 'FOIL', formula: '(a+b)(c+d) = ac + ad + bc + bd', description: 'Multiply every term in the first binomial by every term in the second' },
            { name: 'Difference of squares', formula: '(a+b)(a−b) = a² − b²', description: 'Outer and inner terms cancel' },
            { name: 'Perfect square trinomial', formula: '(a+b)² = a² + 2ab + b²', description: 'Square of a binomial' },
          ],
          workedExamples: [
            {
              problem: 'Expand (2x + 3)(x − 5)',
              steps: [
                'First: 2x × x = 2x²',
                'Outer: 2x × (−5) = −10x',
                'Inner: 3 × x = 3x',
                'Last: 3 × (−5) = −15',
                'Combine: 2x² − 10x + 3x − 15 = 2x² − 7x − 15',
              ],
              answer: '2x² − 7x − 15',
            },
          ],
          keyPoints: [
            'Degree of a polynomial = highest exponent',
            'Like terms must have the same variable AND the same exponent',
            'FOIL is a special case of the distributive property',
          ],
        },
      },
      {
        id: 'alg1-6',
        title: 'Factoring Polynomials',
        duration: '24 min',
        type: 'practice',
        content: {
          overview: 'Factoring is the reverse of expanding. The key techniques are: pulling out the GCF, factoring trinomials (reverse FOIL), difference of squares, and perfect square trinomials.',
          keyFormulas: [
            { name: 'GCF factoring', formula: 'ax² + ax = ax(x + 1)', description: 'Always look for GCF first' },
            { name: 'Trinomial (a=1)', formula: 'x² + bx + c = (x+p)(x+q)  where p+q=b, pq=c', description: 'Find two numbers that multiply to c and add to b' },
            { name: 'Difference of squares', formula: 'a² − b² = (a+b)(a−b)', description: 'Recognise the pattern' },
          ],
          workedExamples: [
            {
              problem: 'Factor x² − 5x + 6',
              steps: [
                'Need two numbers that multiply to 6 and add to −5',
                'Try: (−2)(−3) = 6  and  −2 + (−3) = −5 ✓',
                'Factor: (x − 2)(x − 3)',
              ],
              answer: '(x − 2)(x − 3)',
            },
          ],
          keyPoints: [
            'Always factor out the GCF before using other methods',
            'Check factoring by expanding (FOILing) the result',
            'Not all trinomials factor over the integers — use the quadratic formula then',
          ],
          proTips: ['For ax²+bx+c with a≠1, use the AC method: multiply a×c, find factors that add to b, then split the middle term.'],
        },
      },
      {
        id: 'alg1-7',
        title: 'Quadratic Equations',
        duration: '26 min',
        type: 'theory',
        content: {
          overview: 'A quadratic equation has the form ax² + bx + c = 0. It can be solved by factoring, completing the square, or the quadratic formula. The discriminant b²−4ac tells you how many real solutions exist.',
          keyFormulas: [
            { name: 'Quadratic formula', formula: 'x = (−b ± √(b²−4ac)) / (2a)', description: 'Works for any quadratic; memorise this' },
            { name: 'Discriminant', formula: 'Δ = b² − 4ac', description: 'Δ>0: two real roots; Δ=0: one root; Δ<0: no real roots' },
            { name: 'Completing the square', formula: 'x² + bx = (x + b/2)² − (b/2)²', description: 'Rewrite as a perfect square minus a constant' },
            { name: 'Vieta's formulas', formula: 'x₁+x₂ = −b/a  and  x₁x₂ = c/a', description: 'Sum and product of roots without solving' },
          ],
          workedExamples: [
            {
              problem: 'Solve 2x² − 4x − 6 = 0 using the quadratic formula',
              steps: [
                'a=2, b=−4, c=−6',
                'Δ = (−4)² − 4(2)(−6) = 16 + 48 = 64',
                'x = (4 ± √64) / 4 = (4 ± 8) / 4',
                'x = 12/4 = 3  or  x = −4/4 = −1',
              ],
              answer: 'x = 3  or  x = −1',
            },
          ],
          keyPoints: [
            'Set equation equal to zero before applying any method',
            'Always simplify the discriminant under the radical first',
            'Two rational roots → factorable; irrational roots → use formula',
          ],
          proTips: ['Try factoring first — it's faster. Only use the formula if factoring doesn't work within 30 seconds.'],
        },
      },
    ],
  },

  {
    id: 'algebra2',
    title: 'Algebra II',
    subject: 'Algebra',
    level: 'Intermediate',
    description: 'Extend your algebra skills to functions, complex numbers, logarithms, exponential growth, and an introduction to matrices and sequences.',
    icon: 'stats-chart',
    color: '#9C27B0',
    totalDuration: '5 hrs 40 min',
    skills: ['Function notation', 'Logarithms', 'Exponential functions', 'Complex numbers', 'Sequences'],
    prerequisites: ['Algebra I'],
    lessons: [
      {
        id: 'alg2-1',
        title: 'Functions & Function Notation',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'A function maps each input x to exactly one output f(x). Function notation f(x) replaces y and emphasises the relationship. Key vocabulary includes domain (all valid inputs), range (all possible outputs), and composition.',
          keyFormulas: [
            { name: 'Composition', formula: '(f ∘ g)(x) = f(g(x))', description: 'Apply g first, then f to the result' },
            { name: 'Inverse function', formula: 'f⁻¹(f(x)) = x  and  f(f⁻¹(x)) = x', description: 'Undo the original function' },
          ],
          workedExamples: [
            {
              problem: 'If f(x) = 2x+3 and g(x) = x², find (f∘g)(4)',
              steps: ['g(4) = 4² = 16', 'f(16) = 2(16)+3 = 35'],
              answer: '35',
            },
          ],
          keyPoints: [
            'Vertical Line Test: a graph represents a function if no vertical line crosses it twice',
            'Domain excludes values that cause division by zero or negative square roots',
            'To find an inverse: swap x and y, then solve for y',
          ],
        },
      },
      {
        id: 'alg2-2',
        title: 'Transformations of Functions',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'Any function y=f(x) can be shifted, stretched, reflected, or compressed by modifying its equation. Understanding transformations allows you to sketch complex graphs quickly without plotting many points.',
          keyFormulas: [
            { name: 'Vertical shift', formula: 'y = f(x) + k  (up k) / y = f(x) − k  (down k)', description: 'Adds/subtracts k to every y-value' },
            { name: 'Horizontal shift', formula: 'y = f(x − h)  (right h) / y = f(x + h)  (left h)', description: 'Note: right shift uses minus inside' },
            { name: 'Vertical stretch/compress', formula: 'y = af(x):  |a|>1 stretches, 0<|a|<1 compresses', description: 'Multiplies every y-value by a' },
            { name: 'Reflection', formula: 'y = −f(x) reflects over x-axis;  y = f(−x) reflects over y-axis', description: 'Negating x or y flips the graph' },
          ],
          keyPoints: [
            'Order of transformations: horizontal shifts, stretches/compressions, reflections, vertical shifts',
            'Inside the function affects x (horizontal); outside affects y (vertical)',
            'Horizontal transformations are "backwards" from intuition',
          ],
        },
      },
      {
        id: 'alg2-3',
        title: 'Complex Numbers',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'Complex numbers extend the real numbers by introducing i = √(−1), where i² = −1. Every complex number has the form a + bi where a is the real part and b is the imaginary part. Complex numbers arise when the discriminant of a quadratic is negative.',
          keyFormulas: [
            { name: 'Imaginary unit', formula: 'i = √(−1),  i² = −1,  i³ = −i,  i⁴ = 1', description: 'Powers of i cycle every 4 steps' },
            { name: 'Addition', formula: '(a+bi)+(c+di) = (a+c)+(b+d)i', description: 'Add real and imaginary parts separately' },
            { name: 'Multiplication', formula: '(a+bi)(c+di) = (ac−bd)+(ad+bc)i', description: 'Use FOIL, then replace i²=−1' },
            { name: 'Conjugate & Modulus', formula: 'conj(a+bi)=a−bi;  |a+bi|=√(a²+b²)', description: 'Use conjugate to divide complex numbers' },
          ],
          workedExamples: [
            {
              problem: 'Simplify (3+2i)(1−4i)',
              steps: ['FOIL: 3(1)+3(−4i)+2i(1)+2i(−4i)', '= 3 − 12i + 2i − 8i²', '= 3 − 10i − 8(−1)', '= 11 − 10i'],
              answer: '11 − 10i',
            },
          ],
          keyPoints: ['i² = −1 is the key substitution', 'Complex solutions to quadratics always come in conjugate pairs', 'The complex plane plots a+bi as point (a,b)'],
        },
      },
      {
        id: 'alg2-4',
        title: 'Logarithms',
        duration: '24 min',
        type: 'theory',
        content: {
          overview: 'The logarithm logₐ(x) is the exponent to which base a must be raised to get x. Logarithms are inverses of exponential functions and are essential for solving exponential equations and working with data that spans many orders of magnitude.',
          keyFormulas: [
            { name: 'Definition', formula: 'logₐ(x) = y  ↔  aʸ = x', description: 'Switch freely between log and exponential form' },
            { name: 'Product rule', formula: 'logₐ(mn) = logₐ(m) + logₐ(n)', description: 'Log of a product is a sum of logs' },
            { name: 'Quotient rule', formula: 'logₐ(m/n) = logₐ(m) − logₐ(n)', description: 'Log of a quotient is a difference' },
            { name: 'Power rule', formula: 'logₐ(mⁿ) = n·logₐ(m)', description: 'Exponent becomes a multiplier' },
            { name: 'Change of base', formula: 'logₐ(x) = ln(x)/ln(a) = log(x)/log(a)', description: 'Compute any log using your calculator' },
          ],
          workedExamples: [
            {
              problem: 'Solve log₂(x+3) + log₂(x−1) = 5',
              steps: ['Combine: log₂((x+3)(x−1)) = 5', 'Exponential form: (x+3)(x−1) = 2⁵ = 32', 'x² + 2x − 3 = 32  →  x² + 2x − 35 = 0', '(x+7)(x−5) = 0  →  x=5 (reject x=−7, makes log undefined)'],
              answer: 'x = 5',
            },
          ],
          keyPoints: ['Domain of logₐ(x): x > 0 and a > 0, a ≠ 1', 'ln is log base e (natural log)', 'log with no base written means base 10'],
          proTips: ['When solving log equations, always check that your answer keeps every argument positive.'],
        },
      },
      {
        id: 'alg2-5',
        title: 'Exponential Functions',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'Exponential functions have the form f(x) = a·bˣ where b > 0 and b ≠ 1. When b > 1 the function models growth; when 0 < b < 1 it models decay. They appear in compound interest, radioactive decay, and population models.',
          keyFormulas: [
            { name: 'General form', formula: 'f(x) = a · bˣ', description: 'a = initial value, b = growth/decay factor' },
            { name: 'Continuous growth', formula: 'A = Peʳᵗ', description: 'P = principal, r = rate, t = time, e ≈ 2.718' },
            { name: 'Half-life', formula: 'A(t) = A₀ · (1/2)^(t/h)', description: 'h = half-life period' },
            { name: 'Compound interest', formula: 'A = P(1 + r/n)^(nt)', description: 'n = compoundings per year' },
          ],
          workedExamples: [
            {
              problem: '$5,000 is invested at 6% annual interest compounded monthly. Value after 3 years?',
              steps: ['P=5000, r=0.06, n=12, t=3', 'A = 5000(1 + 0.06/12)^(12×3)', 'A = 5000(1.005)^36', 'A = 5000 × 1.1967 ≈ $5,983.40'],
              answer: '≈ $5,983.40',
            },
          ],
          keyPoints: ['Horizontal asymptote at y=0 (or y=k after vertical shift)', 'Growth factor b > 1; decay factor 0 < b < 1', 'e is Euler's number ≈ 2.71828'],
        },
      },
      {
        id: 'alg2-6',
        title: 'Sequences & Series',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'A sequence is an ordered list of numbers following a pattern. An arithmetic sequence adds a constant difference each step; a geometric sequence multiplies by a constant ratio. A series is the sum of a sequence.',
          keyFormulas: [
            { name: 'Arithmetic nth term', formula: 'aₙ = a₁ + (n−1)d', description: 'd = common difference' },
            { name: 'Arithmetic series sum', formula: 'Sₙ = n/2 × (a₁ + aₙ) = n/2 × (2a₁ + (n−1)d)', description: 'Sum of first n terms' },
            { name: 'Geometric nth term', formula: 'aₙ = a₁ · rⁿ⁻¹', description: 'r = common ratio' },
            { name: 'Geometric series sum', formula: 'Sₙ = a₁(1 − rⁿ)/(1 − r)  for r ≠ 1', description: 'Sum of first n terms' },
            { name: 'Infinite geometric series', formula: 'S∞ = a₁/(1−r)  when |r| < 1', description: 'Converges only when |r| < 1' },
          ],
          workedExamples: [
            {
              problem: 'Find the sum of the first 10 terms of 3, 7, 11, 15, …',
              steps: ['Arithmetic: a₁=3, d=4', 'a₁₀ = 3+(10−1)×4 = 3+36 = 39', 'S₁₀ = 10/2 × (3+39) = 5×42 = 210'],
              answer: '210',
            },
          ],
          keyPoints: ['Check if sequence is arithmetic (constant difference) or geometric (constant ratio) first', 'Sigma notation Σ is shorthand for sums', '|r|<1 is required for an infinite geometric series to converge'],
        },
      },
    ],
  },
  {
    id: 'geometry',
    title: 'Euclidean Geometry',
    subject: 'Geometry',
    level: 'Intermediate',
    description: 'Explore the properties of shapes, angles, and space. Learn proof techniques, similarity, congruence, the Pythagorean theorem, and area and volume formulas.',
    icon: 'triangle',
    color: '#2196F3',
    totalDuration: '5 hrs 55 min',
    skills: ['Angle relationships', 'Triangle congruence', 'Pythagorean theorem', 'Circle geometry', 'Area & volume'],
    prerequisites: ['Pre-Algebra'],
    lessons: [
      {
        id: 'geo-1',
        title: 'Points, Lines & Planes',
        duration: '12 min',
        type: 'theory',
        content: {
          overview: 'Geometry begins with three undefined terms: point (location), line (infinite straight path), and plane (infinite flat surface). All other geometric objects are defined from these. Understanding postulates and how lines intersect is the first step in geometric reasoning.',
          keyFormulas: [
            { name: 'Distance formula', formula: 'd = √((x₂−x₁)² + (y₂−y₁)²)', description: 'Distance between two points in the coordinate plane' },
            { name: 'Midpoint formula', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)', description: 'Point exactly halfway between two points' },
          ],
          keyPoints: ['Two points determine exactly one line', 'Three non-collinear points determine exactly one plane', 'Collinear points lie on the same line; coplanar points lie on the same plane'],
        },
      },
      {
        id: 'geo-2',
        title: 'Angles & Angle Relationships',
        duration: '16 min',
        type: 'theory',
        content: {
          overview: 'Angles are measured in degrees (or radians). Pairs of angles have special relationships — complementary (sum 90°), supplementary (sum 180°), vertical (equal), and corresponding (formed by a transversal crossing parallel lines).',
          keyFormulas: [
            { name: 'Complementary', formula: 'α + β = 90°', description: 'Two angles that together form a right angle' },
            { name: 'Supplementary', formula: 'α + β = 180°', description: 'Two angles that form a straight line' },
            { name: 'Vertical angles', formula: 'α = β (opposite angles at an intersection)', description: 'Always equal' },
          ],
          workedExamples: [
            {
              problem: 'Two parallel lines are cut by a transversal. One co-interior angle is 65°. Find the other.',
              steps: ['Co-interior angles sum to 180°', '65° + x = 180°', 'x = 115°'],
              answer: '115°',
            },
          ],
          keyPoints: ['Angles in a triangle sum to 180°', 'Alternate interior angles are equal (parallel lines)', 'An exterior angle of a triangle equals the sum of the two non-adjacent interior angles'],
        },
      },
      {
        id: 'geo-3',
        title: 'Pythagorean Theorem',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'In any right triangle, the square of the hypotenuse equals the sum of the squares of the two legs. This theorem connects algebra and geometry and is one of the most useful results in all of mathematics.',
          keyFormulas: [
            { name: 'Pythagorean theorem', formula: 'a² + b² = c²', description: 'a, b = legs; c = hypotenuse (opposite right angle)' },
            { name: 'Converse', formula: 'If a²+b²=c² then the triangle is right-angled at C', description: 'Test whether a triangle is right' },
            { name: 'Common Pythagorean triples', formula: '(3,4,5)  (5,12,13)  (8,15,17)  (7,24,25)', description: 'Memorise these to speed up calculations' },
          ],
          workedExamples: [
            {
              problem: 'A ladder 10 m long leans against a wall, with its base 6 m from the wall. How high does it reach?',
              steps: ['a=6, c=10, find b', 'b² = 10² − 6² = 100 − 36 = 64', 'b = 8 m'],
              answer: '8 m',
            },
          ],
          keyPoints: ['Only applies to right triangles', 'The hypotenuse is always the longest side', 'For 45-45-90 triangles: legs = x, hypotenuse = x√2', 'For 30-60-90 triangles: sides are x, x√3, 2x'],
        },
      },
      {
        id: 'geo-4',
        title: 'Congruent Triangles',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'Two triangles are congruent when they have exactly the same shape and size. Rather than checking all six parts, five shortcut postulates (SSS, SAS, ASA, AAS, HL) let you prove congruence from just three pieces of information.',
          keyFormulas: [
            { name: 'SSS', formula: 'Side-Side-Side: all three pairs of sides equal', description: 'Sufficient for congruence' },
            { name: 'SAS', formula: 'Side-Angle-Side: two sides and the included angle', description: 'Included angle is between the two sides' },
            { name: 'ASA', formula: 'Angle-Side-Angle: two angles and the included side', description: 'Included side is between the two angles' },
            { name: 'AAS', formula: 'Angle-Angle-Side: two angles and a non-included side', description: 'Valid congruence shortcut' },
          ],
          keyPoints: ['CPCTC: Corresponding Parts of Congruent Triangles are Congruent', 'AAA only proves similarity, NOT congruence', 'HL (Hypotenuse-Leg) applies only to right triangles'],
        },
      },
      {
        id: 'geo-5',
        title: 'Circles — Arcs, Chords & Sectors',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'A circle is the set of all points equidistant from a center. Key parts include radius, diameter, chord, arc, and sector. Angles in circles relate to arcs in precise ways — inscribed angle theorem, central angles, and tangent properties.',
          keyFormulas: [
            { name: 'Circumference', formula: 'C = 2πr = πd', description: 'Perimeter of a circle' },
            { name: 'Area', formula: 'A = πr²', description: 'Area enclosed by the circle' },
            { name: 'Arc length', formula: 'L = (θ/360°) × 2πr', description: 'θ in degrees' },
            { name: 'Sector area', formula: 'A = (θ/360°) × πr²', description: 'Slice of the circle' },
            { name: 'Inscribed angle theorem', formula: 'Inscribed angle = ½ × intercepted arc', description: 'Central angle = intercepted arc' },
          ],
          workedExamples: [
            {
              problem: 'Find the arc length and sector area of a circle r=9, θ=80°',
              steps: ['Arc length = (80/360) × 2π(9) = (2/9) × 18π = 4π ≈ 12.57', 'Sector area = (80/360) × π(9²) = (2/9) × 81π = 18π ≈ 56.55'],
              answer: 'Arc ≈ 12.57 units, Sector area ≈ 56.55 units²',
            },
          ],
          keyPoints: ['π ≈ 3.14159', 'Tangent to a circle is perpendicular to the radius at the point of tangency', 'An inscribed angle is half the central angle that intercepts the same arc'],
        },
      },
      {
        id: 'geo-6',
        title: 'Area of 2D Figures',
        duration: '16 min',
        type: 'practice',
        content: {
          overview: 'Area measures the amount of 2D space enclosed by a figure. Every polygon's area formula can be derived from the rectangle formula. Composite figures are broken into simpler shapes.',
          keyFormulas: [
            { name: 'Rectangle', formula: 'A = lw', description: 'Length times width' },
            { name: 'Triangle', formula: 'A = ½bh', description: 'Half base times height (height must be perpendicular)' },
            { name: 'Trapezoid', formula: 'A = ½(b₁+b₂)h', description: 'Average of parallel bases times height' },
            { name: 'Parallelogram', formula: 'A = bh', description: 'Base times perpendicular height' },
            { name: 'Regular polygon', formula: 'A = ½ × Perimeter × apothem', description: 'Apothem = distance from center to midpoint of a side' },
          ],
          keyPoints: ['Height is always perpendicular to the base — not the slant side', 'For composite shapes: add or subtract areas of simpler components', 'Units of area are always squared (cm², m², etc.)'],
        },
      },
      {
        id: 'geo-7',
        title: 'Surface Area & Volume',
        duration: '24 min',
        type: 'theory',
        content: {
          overview: 'Surface area is the total area of all faces of a 3D solid. Volume measures the space inside. These formulas are critical for engineering, science, and everyday problem-solving.',
          keyFormulas: [
            { name: 'Rectangular prism', formula: 'V=lwh,  SA=2(lw+lh+wh)', description: 'Box formula' },
            { name: 'Cylinder', formula: 'V=πr²h,  SA=2πr²+2πrh', description: 'Circular cross-section prism' },
            { name: 'Sphere', formula: 'V=(4/3)πr³,  SA=4πr²', description: 'Every point equidistant from center' },
            { name: 'Cone', formula: 'V=(1/3)πr²h,  SA=πr²+πrl  (l=slant height)', description: 'One-third of cylinder volume' },
            { name: 'Pyramid', formula: 'V=(1/3)Bh  (B=base area)', description: 'One-third of prism volume' },
          ],
          workedExamples: [
            {
              problem: 'Find the volume and surface area of a cylinder with r=3, h=10',
              steps: ['V = π(3²)(10) = 90π ≈ 282.74', 'SA = 2π(9) + 2π(3)(10) = 18π + 60π = 78π ≈ 245.04'],
              answer: 'V ≈ 282.74 units³, SA ≈ 245.04 units²',
            },
          ],
          keyPoints: ['Surface area uses square units; volume uses cubic units', 'A cone and pyramid are each 1/3 of the corresponding prism/cylinder', 'Doubling the radius quadruples area but octuplies volume'],
        },
      },
    ],
  },

  {
    id: 'trigonometry',
    title: 'Trigonometry',
    subject: 'Trigonometry',
    level: 'Intermediate',
    description: 'Master the unit circle, the six trig functions, identities, graphs, and the laws of sines and cosines to solve any triangle.',
    icon: 'radio-button-on',
    color: '#FF9800',
    totalDuration: '6 hrs 30 min',
    skills: ['Unit circle', 'Trig functions', 'Trig identities', 'Law of sines', 'Law of cosines'],
    prerequisites: ['Geometry', 'Algebra II'],
    lessons: [
      {
        id: 'trig-1',
        title: 'Angles in Standard Position & Radians',
        duration: '16 min',
        type: 'theory',
        content: {
          overview: 'An angle in standard position has its vertex at the origin and initial side along the positive x-axis. Radians measure angles by arc length: one radian is the angle that subtends an arc equal to the radius. Radians are the preferred unit in calculus.',
          keyFormulas: [
            { name: 'Degree ↔ Radian', formula: '180° = π rad  →  1° = π/180 rad', description: 'Multiply degrees by π/180 to convert' },
            { name: 'Arc length', formula: 's = rθ  (θ in radians)', description: 'r = radius, θ = central angle' },
            { name: 'Coterminal angles', formula: 'θ ± 360°  or  θ ± 2π', description: 'Angles sharing the same terminal side' },
          ],
          keyPoints: ['π radians = 180°; 2π = full circle', 'Reference angle: acute angle to nearest x-axis', 'Positive angles go counter-clockwise; negative go clockwise'],
        },
      },
      {
        id: 'trig-2',
        title: 'The Unit Circle',
        duration: '24 min',
        type: 'theory',
        content: {
          overview: 'The unit circle has radius 1 centered at the origin. Every point on it is (cos θ, sin θ). Knowing the exact coordinates at 30°, 45°, 60°, 90°, and their multiples lets you evaluate trig functions without a calculator.',
          keyFormulas: [
            { name: 'Unit circle definition', formula: 'x = cos θ,  y = sin θ,  x²+y²=1', description: 'Fundamental connection of sin and cos' },
            { name: 'Key values — 30°/π/6', formula: 'sin=1/2, cos=√3/2, tan=1/√3', description: 'Memorise the reference triangle' },
            { name: 'Key values — 45°/π/4', formula: 'sin=√2/2, cos=√2/2, tan=1', description: 'Isoceles right triangle' },
            { name: 'Key values — 60°/π/3', formula: 'sin=√3/2, cos=1/2, tan=√3', description: 'Equilateral triangle half' },
          ],
          keyPoints: ['sin is the y-coordinate; cos is the x-coordinate on the unit circle', 'ASTC rule (All Students Take Calculus): signs of trig functions by quadrant', 'sin and cos are periodic with period 2π; tan has period π'],
          proTips: ['Use the hand trick: label fingers 0,30,45,60,90° — sin value = √(finger number)/2.'],
        },
      },
      {
        id: 'trig-3',
        title: 'The Six Trig Functions',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'Beyond sine and cosine, there are four other trigonometric functions. Each is a ratio of two sides of a right triangle or defined on the unit circle. Their reciprocal relationships are foundational for simplifying expressions.',
          keyFormulas: [
            { name: 'SOH-CAH-TOA', formula: 'sin=opp/hyp  cos=adj/hyp  tan=opp/adj', description: 'Right-triangle definitions' },
            { name: 'Reciprocals', formula: 'csc=1/sin  sec=1/cos  cot=1/tan', description: 'Cosecant, secant, cotangent' },
            { name: 'Pythagorean identities', formula: 'sin²θ+cos²θ=1;  1+tan²θ=sec²θ;  1+cot²θ=csc²θ', description: 'Follow from x²+y²=1' },
          ],
          keyPoints: ['tan θ is undefined at θ = 90°, 270°, …', 'All six functions can be read from the unit circle', 'Reciprocal ≠ inverse: csc ≠ sin⁻¹'],
        },
      },
      {
        id: 'trig-4',
        title: 'Trigonometric Identities',
        duration: '26 min',
        type: 'theory',
        content: {
          overview: 'A trigonometric identity is an equation true for all valid angles. Identities are used to simplify expressions, solve equations, and prepare integrals. The most important are the Pythagorean, co-function, even/odd, and angle-addition identities.',
          keyFormulas: [
            { name: 'Angle addition — sin', formula: 'sin(A±B) = sinA cosB ± cosA sinB', description: 'Works for both + and −' },
            { name: 'Angle addition — cos', formula: 'cos(A±B) = cosA cosB ∓ sinA sinB', description: 'Sign flips for cos' },
            { name: 'Double angle — sin', formula: 'sin(2θ) = 2 sinθ cosθ', description: 'Set A=B=θ in sum formula' },
            { name: 'Double angle — cos', formula: 'cos(2θ) = cos²θ−sin²θ = 2cos²θ−1 = 1−2sin²θ', description: 'Three equivalent forms' },
            { name: 'Half angle', formula: 'sin(θ/2)=±√((1−cosθ)/2);  cos(θ/2)=±√((1+cosθ)/2)', description: 'Sign depends on quadrant' },
          ],
          workedExamples: [
            {
              problem: 'Prove: (sin²θ)/(1−cosθ) = 1+cosθ',
              steps: ['Replace sin²θ = 1−cos²θ', '(1−cos²θ)/(1−cosθ)', 'Factor numerator: (1−cosθ)(1+cosθ)/(1−cosθ)', 'Cancel: 1+cosθ ✓'],
              answer: 'Identity proved',
            },
          ],
          keyPoints: ['Start proofs on the more complex side', 'Never move terms across the equals sign in a proof', 'Pythagorean identities are the most useful — know all three forms'],
        },
      },
      {
        id: 'trig-5',
        title: 'Law of Sines',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'The Law of Sines relates the sides and angles of any triangle (not just right triangles). It is used for the AAS and ASA cases, and for the ambiguous SSA case which may yield 0, 1, or 2 triangles.',
          keyFormulas: [
            { name: 'Law of Sines', formula: 'a/sinA = b/sinB = c/sinC', description: 'Each side over the sine of its opposite angle is constant' },
            { name: 'Area from sines', formula: 'Area = ½ab sinC', description: 'When two sides and the included angle are known' },
          ],
          workedExamples: [
            {
              problem: 'In △ABC: A=42°, B=75°, a=18. Find b.',
              steps: ['C = 180−42−75 = 63°', 'a/sinA = b/sinB  →  18/sin42° = b/sin75°', 'b = 18 × sin75°/sin42° = 18 × 0.9659/0.6691 ≈ 25.97'],
              answer: 'b ≈ 25.97',
            },
          ],
          keyPoints: ['Use Law of Sines when you know angle-side pairs', 'The ambiguous case (SSA): check if the given side is long enough to form a triangle', 'Always verify that angles sum to 180°'],
        },
      },
      {
        id: 'trig-6',
        title: 'Law of Cosines',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'The Law of Cosines generalizes the Pythagorean theorem to any triangle. It is used for the SAS and SSS cases, when the Law of Sines cannot be applied directly.',
          keyFormulas: [
            { name: 'Law of Cosines', formula: 'c² = a² + b² − 2ab cosC', description: 'Also: a²=b²+c²−2bc cosA  and  b²=a²+c²−2ac cosB' },
            { name: 'Finding an angle', formula: 'cosC = (a²+b²−c²)/(2ab)', description: 'Rearranged form to find angles from three sides' },
          ],
          workedExamples: [
            {
              problem: 'Find side c given a=8, b=11, C=35°',
              steps: ['c² = 8²+11²−2(8)(11)cos35°', 'c² = 64+121−176(0.8192)', 'c² = 185−144.18 = 40.82', 'c ≈ 6.39'],
              answer: 'c ≈ 6.39',
            },
          ],
          keyPoints: ['When C=90°, the formula reduces to the Pythagorean theorem', 'Use for SAS (two sides + included angle) or SSS (all three sides)', 'After finding all sides, use Law of Sines to find remaining angles more easily'],
        },
      },
    ],
  },
  {
    id: 'diff-calculus',
    title: 'Differential Calculus',
    subject: 'Calculus',
    level: 'Advanced',
    description: 'Understand limits, the precise definition of the derivative, and all differentiation rules. Apply derivatives to curve sketching, related rates, and optimization.',
    icon: 'trending-up',
    color: '#FF6B6B',
    totalDuration: '8 hrs 15 min',
    skills: ['Limits', 'Derivatives', 'Chain rule', 'Implicit differentiation', 'Optimization'],
    prerequisites: ['Pre-Calculus', 'Algebra II'],
    lessons: [
      {
        id: 'dc-1',
        title: 'Limits & Continuity',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'The limit of f(x) as x→a is the value f(x) approaches (but does not necessarily reach). A function is continuous at a if the limit equals the function value. Limits are the rigorous foundation for all of calculus.',
          keyFormulas: [
            { name: 'Informal limit definition', formula: 'lim(x→a) f(x) = L: f(x) gets close to L as x gets close to a', description: 'Both one-sided limits must equal L' },
            { name: 'Continuity at a', formula: 'lim(x→a) f(x) = f(a)  (limit exists, f(a) defined, they are equal)', description: 'Three conditions required' },
          ],
          workedExamples: [
            {
              problem: 'Evaluate lim(x→3) (x²−9)/(x−3)',
              steps: ['Direct substitution gives 0/0 (indeterminate)', 'Factor: (x−3)(x+3)/(x−3)', 'Cancel (x−3): lim = x+3', 'Substitute x=3: 3+3 = 6'],
              answer: '6',
            },
          ],
          keyPoints: ['Left-hand and right-hand limits must match for the limit to exist', 'Limit does not care about the value at x=a', 'Polynomial and rational functions are continuous on their domains'],
        },
      },
      {
        id: 'dc-2',
        title: 'Definition of the Derivative',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'The derivative f'(x) measures instantaneous rate of change — the slope of the tangent line at a point. It is defined as the limit of the difference quotient as the interval shrinks to zero.',
          keyFormulas: [
            { name: 'Limit definition', formula: "f'(x) = lim(h→0) [f(x+h)−f(x)] / h", description: 'The fundamental definition' },
            { name: 'Alternate form', formula: "f'(a) = lim(x→a) [f(x)−f(a)] / (x−a)", description: 'Derivative at a specific point a' },
          ],
          workedExamples: [
            {
              problem: 'Use the definition to differentiate f(x) = x²',
              steps: ['f(x+h) = (x+h)² = x²+2xh+h²', '[f(x+h)−f(x)]/h = (2xh+h²)/h = 2x+h', 'lim(h→0)(2x+h) = 2x'],
              answer: "f'(x) = 2x",
            },
          ],
          keyPoints: ['The derivative at a point equals the slope of the tangent at that point', 'Differentiability implies continuity (but not vice versa)', 'Notation: f'(x), dy/dx, Df(x) — all mean the same thing'],
        },
      },
      {
        id: 'dc-3',
        title: 'Basic Differentiation Rules',
        duration: '18 min',
        type: 'practice',
        content: {
          overview: 'Rather than using the limit definition every time, a set of shortcut rules covers all standard functions. These rules are derived once from the definition and then used routinely.',
          keyFormulas: [
            { name: 'Power rule', formula: 'd/dx(xⁿ) = nxⁿ⁻¹', description: 'Most frequently used rule' },
            { name: 'Constant rule', formula: 'd/dx(c) = 0', description: 'Constants vanish' },
            { name: 'Constant multiple', formula: 'd/dx[cf(x)] = c·f'(x)', description: 'Constants factor out' },
            { name: 'Sum/Difference', formula: 'd/dx[f±g] = f'±g'', description: 'Differentiate term by term' },
            { name: 'Trig derivatives', formula: 'd/dx(sinx)=cosx;  d/dx(cosx)=−sinx;  d/dx(tanx)=sec²x', description: 'Core trig derivatives' },
            { name: 'Exponential', formula: 'd/dx(eˣ)=eˣ;  d/dx(aˣ)=aˣ ln(a)', description: 'eˣ is its own derivative' },
            { name: 'Logarithm', formula: 'd/dx(ln x)=1/x;  d/dx(logₐx)=1/(x ln a)', description: 'Natural log rule' },
          ],
          keyPoints: ['Power rule works for any real exponent, including fractions and negatives', 'd/dx(eˣ)=eˣ is the only function equal to its own derivative', 'Learn sin/cos cycle: sin→cos→−sin→−cos→sin'],
        },
      },
      {
        id: 'dc-4',
        title: 'Product & Quotient Rule',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'When differentiating products or quotients of two functions, the sum/difference rule no longer applies. The product and quotient rules provide the correct formulas.',
          keyFormulas: [
            { name: 'Product rule', formula: 'd/dx[fg] = f'g + fg'', description: '"First d-second plus second d-first"' },
            { name: 'Quotient rule', formula: 'd/dx[f/g] = (f'g − fg') / g²', description: '"Lo d-hi minus hi d-lo, over lo squared"' },
          ],
          workedExamples: [
            {
              problem: 'Differentiate h(x) = x³ sinx',
              steps: ['f=x³, g=sinx', "f'=3x², g'=cosx", "h'=3x²·sinx + x³·cosx"],
              answer: "h'(x) = 3x²sinx + x³cosx",
            },
          ],
          keyPoints: ['Product rule: two terms (don't forget the plus)', 'Quotient rule: denominator squared — never forget!', 'Can rewrite x as product using product rule instead of quotient rule sometimes'],
        },
      },
      {
        id: 'dc-5',
        title: 'The Chain Rule',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'The chain rule differentiates composite functions f(g(x)). The derivative is: differentiate the outer function (leaving inner unchanged) times differentiate the inner function. It is the most frequently used rule in calculus.',
          keyFormulas: [
            { name: 'Chain rule', formula: 'd/dx[f(g(x))] = f'(g(x)) · g'(x)', description: 'Outer derivative times inner derivative' },
            { name: 'Leibniz form', formula: 'dy/dx = (dy/du)(du/dx)', description: 'Chain of rates of change' },
          ],
          workedExamples: [
            {
              problem: 'Differentiate y = sin(3x²+1)',
              steps: ['Outer: sin(u), inner: u=3x²+1', 'd/dx[sin(u)] = cos(u)', "u' = 6x", "y' = cos(3x²+1) · 6x"],
              answer: "y' = 6x cos(3x²+1)",
            },
          ],
          keyPoints: ['Identify inner and outer functions first', 'Apply chain rule repeatedly for nested compositions', 'Chain rule + product rule together: most calculus problems can be differentiated'],
        },
      },
      {
        id: 'dc-6',
        title: 'Optimization Problems',
        duration: '28 min',
        type: 'practice',
        content: {
          overview: 'Derivatives locate maxima and minima. At a local extremum, f'(x)=0 (or is undefined). The second derivative test confirms whether a critical point is a max (f''<0) or min (f''> 0).',
          keyFormulas: [
            { name: 'Critical points', formula: "f'(c) = 0  or  f'(c) undefined", description: 'Candidates for maxima/minima' },
            { name: 'Second derivative test', formula: "f''(c)<0: local max;  f''(c)>0: local min;  f''(c)=0: inconclusive", description: 'Concavity determines the type' },
            { name: 'Closed interval method', formula: 'Evaluate f at all critical points and endpoints; compare values', description: 'For absolute extrema on [a,b]' },
          ],
          workedExamples: [
            {
              problem: 'Find dimensions of a rectangle with perimeter 40 that maximise area.',
              steps: ['Let width=x, length=20−x (since 2x+2l=40)', 'Area = x(20−x) = 20x−x²', "A'(x) = 20−2x = 0  →  x=10", "A''(10) = −2 < 0: maximum", 'Dimensions: 10×10 (a square)'],
              answer: '10 × 10 (area = 100)',
            },
          ],
          keyPoints: ['Always check endpoints for absolute extrema on a closed interval', 'Model the problem with a single-variable function before differentiating', 'Verify your answer makes physical sense'],
          proTips: ['Draw a diagram and label variables before writing any equation.'],
        },
      },
    ],
  },
  {
    id: 'integral-calculus',
    title: 'Integral Calculus',
    subject: 'Calculus',
    level: 'Advanced',
    description: 'From antiderivatives and Riemann sums to the Fundamental Theorem of Calculus and advanced integration techniques including substitution, by-parts, and applications.',
    icon: 'arrow-down',
    color: '#F44336',
    totalDuration: '7 hrs 40 min',
    skills: ['Antiderivatives', 'Definite integrals', 'u-substitution', 'Integration by parts', 'Area & volume'],
    prerequisites: ['Differential Calculus'],
    lessons: [
      {
        id: 'ic-1',
        title: 'Antiderivatives & Indefinite Integrals',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'An antiderivative F(x) of f(x) satisfies F'(x)=f(x). The indefinite integral ∫f(x)dx represents the family of all antiderivatives, which differ by a constant C. Integration is the reverse process of differentiation.',
          keyFormulas: [
            { name: 'Power rule (integration)', formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)', description: 'Reverse of power rule for derivatives' },
            { name: 'Constant rule', formula: '∫k dx = kx + C', description: 'Integral of a constant' },
            { name: 'Exponential', formula: '∫eˣ dx = eˣ + C;  ∫aˣ dx = aˣ/ln(a) + C', description: 'eˣ integral equals itself' },
            { name: 'Trig integrals', formula: '∫sinx dx = −cosx+C;  ∫cosx dx = sinx+C;  ∫sec²x dx = tanx+C', description: 'Reverse trig derivatives' },
          ],
          keyPoints: ['Always add +C to indefinite integrals', '∫1/x dx = ln|x| + C — absolute value required', 'Differentiate your answer to verify'],
        },
      },
      {
        id: 'ic-2',
        title: 'Definite Integrals & Area',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'The definite integral ∫[a to b] f(x)dx gives the net signed area between f(x) and the x-axis from a to b. Areas below the x-axis are counted as negative.',
          keyFormulas: [
            { name: 'Fundamental Theorem — Part 2', formula: '∫[a,b] f(x)dx = F(b) − F(a)', description: 'F is any antiderivative of f' },
            { name: 'Properties', formula: '∫[a,b] f+g = ∫f+∫g;  ∫[a,b] cf = c∫f;  ∫[a,b] f = −∫[b,a] f', description: 'Linearity and direction' },
          ],
          workedExamples: [
            {
              problem: 'Evaluate ∫[1 to 4] (3x²−2x) dx',
              steps: ['Antiderivative: x³−x²', 'F(4)−F(1) = (64−16)−(1−1)', '= 48 − 0 = 48'],
              answer: '48',
            },
          ],
          keyPoints: ['The definite integral is a number; the indefinite integral is a family of functions', 'Net area can be zero even if function is nonzero (positive and negative cancel)', 'Split integral if function crosses x-axis for total (geometric) area'],
        },
      },
      {
        id: 'ic-3',
        title: 'u-Substitution',
        duration: '24 min',
        type: 'practice',
        content: {
          overview: 'u-substitution is the integration analogue of the chain rule. Choosing u = inner function transforms a complex integral into a simpler one. It is the most used integration technique.',
          keyFormulas: [
            { name: 'u-sub formula', formula: '∫f(g(x))g'(x)dx = ∫f(u)du  where u=g(x), du=g'(x)dx', description: 'Substitute u, convert du, integrate, substitute back' },
          ],
          workedExamples: [
            {
              problem: 'Evaluate ∫2x(x²+1)⁵ dx',
              steps: ['Let u = x²+1, du = 2x dx', '∫u⁵ du = u⁶/6 + C', 'Substitute back: (x²+1)⁶/6 + C'],
              answer: '(x²+1)⁶/6 + C',
            },
          ],
          keyPoints: ['Choose u to be the inner function of a composition', 'du must appear (or be creatable) in the original integral', 'For definite integrals, either change the limits or substitute back before evaluating'],
          proTips: ['If you see a function and its derivative in the integrand — that's a u-sub candidate.'],
        },
      },
      {
        id: 'ic-4',
        title: 'Integration by Parts',
        duration: '26 min',
        type: 'theory',
        content: {
          overview: 'Integration by parts comes from reversing the product rule. It is used for integrals of products where u-sub doesn't work. The LIATE rule guides the choice of u.',
          keyFormulas: [
            { name: 'Integration by parts', formula: '∫u dv = uv − ∫v du', description: 'Both u and dv must be chosen from the integrand' },
            { name: 'LIATE rule', formula: 'Prefer u in order: Logs, Inverse trig, Algebraic, Trig, Exponential', description: 'Choose u as the first type that appears' },
          ],
          workedExamples: [
            {
              problem: 'Evaluate ∫x eˣ dx',
              steps: ['LIATE: u=x (Algebraic), dv=eˣdx', 'du=dx, v=eˣ', '∫x eˣ dx = xeˣ − ∫eˣ dx', '= xeˣ − eˣ + C'],
              answer: 'xeˣ − eˣ + C  =  eˣ(x−1) + C',
            },
          ],
          keyPoints: ['Sometimes apply by-parts twice for integrals like ∫x² eˣ dx', 'Tabular method speeds up repeated by-parts applications', '∫ln(x)dx is a classic by-parts with dv=dx'],
        },
      },
      {
        id: 'ic-5',
        title: 'Area Between Curves & Volumes',
        duration: '28 min',
        type: 'practice',
        content: {
          overview: 'The integral extends to finding area between two curves (subtract lower from upper) and volumes of revolution using the disk/washer method (integrate cross-sectional areas).',
          keyFormulas: [
            { name: 'Area between curves', formula: 'A = ∫[a,b] [f(x)−g(x)] dx  (f ≥ g on [a,b])', description: 'Top function minus bottom function' },
            { name: 'Disk method (about x-axis)', formula: 'V = π∫[a,b] [f(x)]² dx', description: 'Rotate f(x) around x-axis' },
            { name: 'Washer method', formula: 'V = π∫[a,b] ([f(x)]² − [g(x)]²) dx', description: 'Outer radius² minus inner radius²' },
          ],
          workedExamples: [
            {
              problem: 'Find the area between y=x² and y=x from x=0 to x=1',
              steps: ['y=x > y=x² on [0,1]', 'A = ∫[0,1] (x−x²) dx', '= [x²/2 − x³/3] from 0 to 1', '= 1/2 − 1/3 = 1/6'],
              answer: '1/6',
            },
          ],
          keyPoints: ['Always identify which function is on top before integrating', 'Find intersection points by setting f(x)=g(x)', 'Units of area are squared; units of volume are cubed'],
        },
      },
    ],
  },

  {
    id: 'statistics',
    title: 'Statistics & Probability',
    subject: 'Statistics',
    level: 'Intermediate',
    description: 'Learn to collect, summarise, and draw conclusions from data. Covers descriptive statistics, probability, distributions, confidence intervals, and hypothesis testing.',
    icon: 'bar-chart',
    color: '#00BCD4',
    totalDuration: '5 hrs 50 min',
    skills: ['Descriptive statistics', 'Probability', 'Normal distribution', 'Confidence intervals', 'Hypothesis testing'],
    prerequisites: ['Algebra I'],
    lessons: [
      {
        id: 'stat-1',
        title: 'Measures of Center',
        duration: '16 min',
        type: 'theory',
        content: {
          overview: 'Measures of center describe the typical or middle value in a data set. Mean (arithmetic average), median (middle value), and mode (most frequent) each capture a different aspect of center and are affected differently by outliers.',
          keyFormulas: [
            { name: 'Mean', formula: 'x̄ = (Σxᵢ) / n', description: 'Sum of all values divided by count' },
            { name: 'Median', formula: 'Middle value when sorted; average of two middle values if n is even', description: 'Resistant to outliers' },
            { name: 'Weighted mean', formula: 'x̄ = Σ(wᵢxᵢ) / Σwᵢ', description: 'Used for grade calculations, etc.' },
          ],
          workedExamples: [
            {
              problem: 'Find mean, median, and mode of: 4, 7, 7, 9, 12, 15',
              steps: ['Mean = (4+7+7+9+12+15)/6 = 54/6 = 9', 'Sorted already; n=6, median = (7+9)/2 = 8', 'Mode = 7 (appears twice)'],
              answer: 'Mean=9, Median=8, Mode=7',
            },
          ],
          keyPoints: ['Mean is pulled toward outliers; median is resistant', 'For symmetric distributions, mean ≈ median', 'Use median for skewed data (e.g. household income)'],
        },
      },
      {
        id: 'stat-2',
        title: 'Measures of Spread',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'Spread describes how dispersed data values are around the center. Key measures are range, variance, standard deviation, and the interquartile range (IQR). Standard deviation is the most commonly reported.',
          keyFormulas: [
            { name: 'Variance (population)', formula: 'σ² = Σ(xᵢ−μ)² / N', description: 'Average squared deviation from mean' },
            { name: 'Standard deviation', formula: 'σ = √(σ²)', description: 'Square root of variance — same units as data' },
            { name: 'Sample variance', formula: 's² = Σ(xᵢ−x̄)² / (n−1)', description: 'Divides by n−1 (Bessel's correction) for sample data' },
            { name: 'IQR', formula: 'IQR = Q3 − Q1', description: 'Range of the middle 50% of data' },
          ],
          keyPoints: ['Standard deviation is in the same units as the data', 'IQR is resistant to outliers; standard deviation is not', 'Outlier rule: any value more than 1.5×IQR below Q1 or above Q3'],
        },
      },
      {
        id: 'stat-3',
        title: 'Probability Fundamentals',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'Probability measures likelihood on a scale from 0 (impossible) to 1 (certain). The sample space S contains all possible outcomes; events are subsets of S. Addition and multiplication rules handle compound events.',
          keyFormulas: [
            { name: 'Classical probability', formula: 'P(A) = (favorable outcomes) / (total outcomes)', description: 'Assumes equally likely outcomes' },
            { name: 'Complement rule', formula: 'P(A') = 1 − P(A)', description: 'Probability event does NOT occur' },
            { name: 'Addition rule', formula: 'P(A∪B) = P(A)+P(B)−P(A∩B)', description: 'Subtract overlap to avoid double-counting' },
            { name: 'Multiplication rule', formula: 'P(A∩B) = P(A)·P(B|A)', description: 'P(B|A) = conditional probability of B given A' },
            { name: 'Independent events', formula: 'P(A∩B) = P(A)·P(B)', description: 'Events are independent if P(B|A)=P(B)' },
          ],
          workedExamples: [
            {
              problem: 'A card is drawn from a deck. Find P(red OR face card).',
              steps: ['P(red)=26/52=1/2', 'P(face)=12/52=3/13', 'P(red AND face)=6/52=3/26', 'P(red OR face) = 1/2+3/13−3/26 = 13/26+6/26−3/26 = 16/26 = 8/13'],
              answer: '8/13 ≈ 0.615',
            },
          ],
          keyPoints: ['Mutually exclusive: P(A∩B)=0, so P(A∪B)=P(A)+P(B)', 'Independent ≠ mutually exclusive', 'P(A|B) = P(A∩B)/P(B)'],
        },
      },
      {
        id: 'stat-4',
        title: 'Normal Distribution & Z-Scores',
        duration: '24 min',
        type: 'theory',
        content: {
          overview: 'The normal (Gaussian) distribution is bell-shaped, symmetric, and completely described by its mean μ and standard deviation σ. The standard normal has μ=0 and σ=1. Z-scores convert any normal value to standard normal for table lookup.',
          keyFormulas: [
            { name: 'Z-score', formula: 'z = (x − μ) / σ', description: 'Number of standard deviations x is from the mean' },
            { name: 'Empirical rule', formula: '68% within 1σ;  95% within 2σ;  99.7% within 3σ', description: 'Also called the 68-95-99.7 rule' },
          ],
          workedExamples: [
            {
              problem: 'IQ scores are normally distributed with μ=100, σ=15. What % of people score above 130?',
              steps: ['z = (130−100)/15 = 2.0', 'P(Z<2.0) = 0.9772 (from z-table)', 'P(Z>2.0) = 1−0.9772 = 0.0228'],
              answer: 'About 2.28% score above 130',
            },
          ],
          keyPoints: ['Normal distribution is symmetric: mean = median = mode', 'Z-score > 2 or < −2 is considered unusual', 'Many natural phenomena are approximately normally distributed'],
        },
      },
      {
        id: 'stat-5',
        title: 'Confidence Intervals',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'A confidence interval (CI) is a range of values that likely contains the true population parameter. A 95% CI means: if we repeated the sampling 100 times, about 95 of the intervals would contain the true parameter.',
          keyFormulas: [
            { name: 'CI for population mean (σ known)', formula: 'x̄ ± z*(σ/√n)', description: 'z*=1.96 for 95%; 2.576 for 99%' },
            { name: 'CI for population mean (σ unknown)', formula: 'x̄ ± t*(s/√n)', description: 't* from t-distribution with df=n−1' },
            { name: 'Margin of error', formula: 'E = z*(σ/√n)', description: 'Half-width of the confidence interval' },
          ],
          keyPoints: ['Wider CI = more confidence but less precision', 'Increasing n (sample size) narrows the interval', 'CI gives a range, not the probability the parameter is in that specific interval after calculation'],
        },
      },
      {
        id: 'stat-6',
        title: 'Hypothesis Testing',
        duration: '26 min',
        type: 'theory',
        content: {
          overview: 'Hypothesis testing is a formal procedure for deciding whether data provides enough evidence to reject a null hypothesis H₀ in favor of an alternative H₁. The p-value measures how extreme the observed data would be if H₀ were true.',
          keyFormulas: [
            { name: 'Test statistic (z)', formula: 'z = (x̄ − μ₀) / (σ/√n)', description: 'How many standard errors x̄ is from claimed μ₀' },
            { name: 'Test statistic (t)', formula: 't = (x̄ − μ₀) / (s/√n)  with df=n−1', description: 'Used when σ is unknown' },
            { name: 'Decision rule', formula: 'Reject H₀ if p-value < α (significance level)', description: 'Common α values: 0.05 and 0.01' },
          ],
          workedExamples: [
            {
              problem: 'A company claims their battery lasts 500 hours. A sample of 36 gives x̄=492, s=24. Test at α=0.05.',
              steps: ['H₀: μ=500  H₁: μ<500 (one-tailed)', 't = (492−500)/(24/√36) = −8/4 = −2.0', 'df=35; p-value ≈ 0.027', 'p=0.027 < α=0.05 → Reject H₀'],
              answer: 'Sufficient evidence the battery lasts less than 500 hours',
            },
          ],
          keyPoints: ['Never "accept" H₀ — only fail to reject it', 'Type I error: reject H₀ when it is true (rate = α)', 'Type II error: fail to reject H₀ when H₁ is true', 'Lower α = stricter test = less risk of Type I error'],
        },
      },
    ],
  },
  {
    id: 'linear-algebra',
    title: 'Linear Algebra',
    subject: 'Linear Algebra',
    level: 'College',
    description: 'The mathematics of vectors and linear transformations. Essential for machine learning, computer graphics, physics, and engineering.',
    icon: 'grid',
    color: '#607D8B',
    totalDuration: '7 hrs 20 min',
    skills: ['Vectors', 'Matrix operations', 'Determinants', 'Row reduction', 'Eigenvalues'],
    prerequisites: ['Algebra II', 'Pre-Calculus'],
    lessons: [
      {
        id: 'la-1',
        title: 'Vectors & Vector Operations',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'A vector is a quantity with both magnitude and direction, represented as an ordered list of numbers (components). Vectors in Rⁿ can be added, subtracted, and scaled by scalars. They are foundational to linear algebra, physics, and machine learning.',
          keyFormulas: [
            { name: 'Vector addition', formula: 'u+v = (u₁+v₁, u₂+v₂, … uₙ+vₙ)', description: 'Add corresponding components' },
            { name: 'Scalar multiplication', formula: 'c·v = (cv₁, cv₂, … cvₙ)', description: 'Scale every component by c' },
            { name: 'Magnitude', formula: '|v| = √(v₁²+v₂²+…+vₙ²)', description: 'Length of the vector' },
            { name: 'Unit vector', formula: 'û = v/|v|', description: 'Vector of length 1 in direction of v' },
          ],
          keyPoints: ['Vectors can be in any dimension n', 'The zero vector 0 has no direction', 'Linear combination: c₁v₁+c₂v₂+…+cₖvₖ is the core operation of linear algebra'],
        },
      },
      {
        id: 'la-2',
        title: 'Dot Product & Cross Product',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'The dot product measures how parallel two vectors are (scalar result). The cross product (3D only) gives a vector perpendicular to both inputs and measures area of the parallelogram they span.',
          keyFormulas: [
            { name: 'Dot product', formula: 'u·v = u₁v₁+u₂v₂+…+uₙvₙ = |u||v|cosθ', description: 'Scalar result; zero if perpendicular' },
            { name: 'Cross product (3D)', formula: 'u×v = (u₂v₃−u₃v₂, u₃v₁−u₁v₃, u₁v₂−u₂v₁)', description: 'Perpendicular to both u and v' },
            { name: 'Angle between vectors', formula: 'cosθ = (u·v)/(|u||v|)', description: 'Rearrangement of dot product formula' },
          ],
          keyPoints: ['u·v=0 ⟺ u⊥v (orthogonal)', 'Dot product is commutative; cross product is anti-commutative: u×v = −(v×u)', '|u×v| = |u||v|sinθ = area of parallelogram'],
        },
      },
      {
        id: 'la-3',
        title: 'Matrices & Matrix Operations',
        duration: '20 min',
        type: 'theory',
        content: {
          overview: 'A matrix is a rectangular array of numbers. Matrices represent linear transformations, systems of equations, and data. Addition (same size) and scalar multiplication work entry-by-entry; matrix multiplication is more nuanced.',
          keyFormulas: [
            { name: 'Matrix addition', formula: '(A+B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ', description: 'A and B must have the same dimensions' },
            { name: 'Matrix multiplication', formula: '(AB)ᵢⱼ = Σₖ AᵢₖBₖⱼ', description: 'Row of A times column of B; requires A cols = B rows' },
            { name: 'Transpose', formula: '(Aᵀ)ᵢⱼ = Aⱼᵢ', description: 'Flip rows and columns' },
            { name: 'Identity matrix', formula: 'I: 1s on diagonal, 0s elsewhere; AI=IA=A', description: 'Multiplicative identity for matrices' },
          ],
          keyPoints: ['Matrix multiplication is NOT commutative in general: AB ≠ BA', 'Only square matrices can be invertible', '(AB)ᵀ = BᵀAᵀ — reverse order on transpose'],
        },
      },
      {
        id: 'la-4',
        title: 'Determinants',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'The determinant is a scalar function of a square matrix. It tells whether the matrix is invertible (det≠0), the scale factor of the linear transformation, and the signed area/volume of transformed basis vectors.',
          keyFormulas: [
            { name: '2×2 determinant', formula: 'det([[a,b],[c,d]]) = ad − bc', description: 'Main diagonal minus off-diagonal' },
            { name: '3×3 expansion', formula: 'det(A) = a₁₁(M₁₁)−a₁₂(M₁₂)+a₁₃(M₁₃)', description: 'Cofactor expansion along first row; Mᵢⱼ = minor' },
            { name: 'Invertibility', formula: 'A is invertible ⟺ det(A) ≠ 0', description: 'Key connection' },
          ],
          workedExamples: [
            {
              problem: 'Find det([[2,3],[1,4]])',
              steps: ['det = (2)(4)−(3)(1) = 8−3 = 5'],
              answer: '5',
            },
          ],
          keyPoints: ['Swapping two rows negates the determinant', 'det(AB)=det(A)·det(B)', 'det(Aᵀ)=det(A)'],
        },
      },
      {
        id: 'la-5',
        title: 'Eigenvalues & Eigenvectors',
        duration: '28 min',
        type: 'theory',
        content: {
          overview: 'An eigenvector of a matrix A is a nonzero vector v such that Av=λv — the matrix only scales it, not rotates it. λ is the corresponding eigenvalue. Eigen-decomposition underlies Google's PageRank, PCA, and quantum mechanics.',
          keyFormulas: [
            { name: 'Eigenvalue equation', formula: 'Av = λv  →  (A−λI)v = 0', description: 'v is nonzero solution' },
            { name: 'Characteristic equation', formula: 'det(A−λI) = 0', description: 'Solve for eigenvalues λ' },
            { name: 'Diagonalization', formula: 'A = PDP⁻¹  where D = diag(λ₁,λ₂,…)', description: 'P = matrix of eigenvectors' },
          ],
          workedExamples: [
            {
              problem: 'Find eigenvalues of A = [[3,1],[0,2]]',
              steps: ['det(A−λI) = det([[3−λ,1],[0,2−λ]]) = 0', '(3−λ)(2−λ)−0 = 0', 'λ²−5λ+6 = 0', '(λ−3)(λ−2) = 0  →  λ=3 or λ=2'],
              answer: 'λ₁=3, λ₂=2',
            },
          ],
          keyPoints: ['An n×n matrix has at most n eigenvalues', 'Symmetric matrices have real eigenvalues and orthogonal eigenvectors', 'Eigenvalues of a triangular matrix are its diagonal entries'],
        },
      },
      {
        id: 'la-6',
        title: 'Solving Linear Systems via Row Reduction',
        duration: '24 min',
        type: 'practice',
        content: {
          overview: 'Gaussian elimination systematically reduces a matrix to row echelon form (REF) or reduced row echelon form (RREF) using three elementary row operations. RREF gives solutions directly.',
          keyFormulas: [
            { name: 'Row operations', formula: '1) Swap rows  2) Multiply row by c≠0  3) Add multiple of one row to another', description: 'Preserve the solution set' },
            { name: 'Augmented matrix', formula: '[A|b] represents the system Ax=b', description: 'Coefficient matrix augmented with RHS' },
          ],
          workedExamples: [
            {
              problem: 'Solve: x+y=4 and 2x−y=2 by row reduction',
              steps: ['Augmented: [[1,1,4],[2,−1,2]]', 'R2→R2−2R1: [[1,1,4],[0,−3,−6]]', 'R2→R2/(−3): [[1,1,4],[0,1,2]]', 'R1→R1−R2: [[1,0,2],[0,1,2]]', 'x=2, y=2'],
              answer: 'x=2, y=2',
            },
          ],
          keyPoints: ['Pivot positions are the leading 1s in each row of RREF', 'Free variables (non-pivot columns) give infinitely many solutions', 'A system has no solution iff a row [0,0,…0,1] appears in RREF'],
        },
      },
    ],
  },
  {
    id: 'number-theory',
    title: 'Number Theory',
    subject: 'Number Theory',
    level: 'Intermediate',
    description: 'Explore the elegant properties of integers: divisibility, primes, modular arithmetic, and mathematical induction. The language of cryptography and competition math.',
    icon: 'infinite',
    color: '#795548',
    totalDuration: '4 hrs 50 min',
    skills: ['Divisibility', 'Prime numbers', 'Modular arithmetic', 'Mathematical induction'],
    prerequisites: ['Algebra I'],
    lessons: [
      {
        id: 'nt-1',
        title: 'Divisibility Rules',
        duration: '14 min',
        type: 'theory',
        content: {
          overview: 'Divisibility rules let you quickly determine if a large number is divisible by small integers without performing long division. They are shortcuts derived from properties of our base-10 number system.',
          keyFormulas: [
            { name: 'By 2', formula: 'Last digit is even (0,2,4,6,8)', description: 'Even numbers' },
            { name: 'By 3', formula: 'Sum of digits is divisible by 3', description: 'e.g. 123: 1+2+3=6 ✓' },
            { name: 'By 4', formula: 'Last two digits form a number divisible by 4', description: 'e.g. 1732: 32÷4=8 ✓' },
            { name: 'By 9', formula: 'Sum of digits is divisible by 9', description: 'Stronger version of the rule for 3' },
            { name: 'By 11', formula: 'Alternating sum of digits is divisible by 11', description: 'e.g. 1364: 1−3+6−4=0 ✓' },
          ],
          keyPoints: ['Divisibility by 6 = divisible by 2 AND 3', 'Divisibility by 12 = divisible by 4 AND 3', 'These rules only work in base 10'],
        },
      },
      {
        id: 'nt-2',
        title: 'Prime Numbers & the Sieve of Eratosthenes',
        duration: '18 min',
        type: 'theory',
        content: {
          overview: 'A prime number has exactly two distinct positive divisors: 1 and itself. The Fundamental Theorem of Arithmetic states every integer >1 has a unique prime factorization. The Sieve of Eratosthenes efficiently finds all primes up to N.',
          keyFormulas: [
            { name: 'Fundamental Theorem', formula: 'Every n>1: n = p₁^a₁ × p₂^a₂ × … × pₖ^aₖ (unique)', description: 'The prime factorization is unique up to order' },
            { name: 'Number of divisors', formula: 'τ(n) = (a₁+1)(a₂+1)…(aₖ+1)', description: 'From prime factorization' },
          ],
          workedExamples: [
            {
              problem: 'Find the prime factorization of 360',
              steps: ['360÷2=180, 180÷2=90, 90÷2=45', '45÷3=15, 15÷3=5, 5 is prime', '360 = 2³×3²×5¹'],
              answer: '2³ × 3² × 5',
            },
          ],
          keyPoints: ['1 is NOT a prime number', 'There are infinitely many primes (Euclid's proof)', 'Sieve: to find primes up to N, only check factors up to √N'],
        },
      },
      {
        id: 'nt-3',
        title: 'Modular Arithmetic',
        duration: '22 min',
        type: 'theory',
        content: {
          overview: 'Modular arithmetic is "clock arithmetic" — numbers wrap around after reaching the modulus. a ≡ b (mod m) means m divides (a−b). It is fundamental to cryptography (RSA), computer science (hashing), and competition mathematics.',
          keyFormulas: [
            { name: 'Congruence definition', formula: 'a ≡ b (mod m)  ⟺  m | (a−b)', description: 'a and b leave the same remainder when divided by m' },
            { name: 'Addition/Multiplication', formula: 'If a≡b and c≡d (mod m), then (a+c)≡(b+d) and ac≡bd (mod m)', description: 'Congruences behave like equations' },
            { name: 'Modular inverse', formula: 'a⁻¹ exists (mod m) ⟺ GCD(a,m)=1', description: 'The inverse satisfies a·a⁻¹ ≡ 1 (mod m)' },
          ],
          workedExamples: [
            {
              problem: 'Find the remainder when 7¹⁰⁰ is divided by 5',
              steps: ['7 ≡ 2 (mod 5)', '7¹⁰⁰ ≡ 2¹⁰⁰ (mod 5)', '2⁴=16≡1 (mod 5), so powers of 2 cycle every 4', '100 = 4×25, so 2¹⁰⁰=(2⁴)²⁵≡1²⁵=1 (mod 5)'],
              answer: 'Remainder = 1',
            },
          ],
          keyPoints: ['Modular arithmetic underpins all modern cryptography', 'Fermat's Little Theorem: if p is prime and GCD(a,p)=1, then aᵖ⁻¹≡1 (mod p)', 'Chinese Remainder Theorem: solve systems of congruences'],
        },
      },
      {
        id: 'nt-4',
        title: 'Mathematical Induction',
        duration: '26 min',
        type: 'theory',
        content: {
          overview: 'Mathematical induction is a proof technique for statements about natural numbers. Prove the base case (n=1), then prove the inductive step (if true for n=k, then true for n=k+1). This propagates truth like toppling dominoes.',
          keyFormulas: [
            { name: 'Induction structure', formula: '1) Base case: P(1) true  2) Inductive step: P(k)→P(k+1)  3) Conclude: P(n) for all n≥1', description: 'Two steps to prove all cases' },
            { name: 'Sum formula', formula: '1+2+3+…+n = n(n+1)/2', description: 'Classic result proved by induction' },
            { name: 'Sum of squares', formula: '1²+2²+…+n² = n(n+1)(2n+1)/6', description: 'Another induction result' },
          ],
          workedExamples: [
            {
              problem: 'Prove 1+2+…+n = n(n+1)/2 by induction',
              steps: ['Base: n=1: LHS=1, RHS=1(2)/2=1 ✓', 'Assume true for k: 1+…+k = k(k+1)/2', 'Show for k+1: 1+…+k+(k+1) = k(k+1)/2+(k+1)', '= (k+1)(k/2+1) = (k+1)(k+2)/2 ✓'],
              answer: 'Proved for all n≥1',
            },
          ],
          keyPoints: ['The inductive hypothesis is the assumption for n=k', 'Strong induction: assume true for ALL values ≤k, not just k', 'Induction proves but doesn't explain WHY the formula is true — try to understand the intuition separately'],
          proTips: ['When in doubt with the inductive step, write out both sides of what you need to show before manipulating.'],
        },
      },
    ],
  },
];

export const SUBJECTS = Array.from(new Set(COURSES.map(c => c.subject)));
export const LEVELS: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'College'];
