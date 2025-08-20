// Mock-Daten für die Fashion-Website
export const categories = [
  { id: 1, name: 'Damen', slug: 'damen', icon: 'user' },
  { id: 2, name: 'Herren', slug: 'herren', icon: 'users' },
  { id: 3, name: 'Accessoires', slug: 'accessoires', icon: 'shopping-bag' },
  { id: 4, name: 'Schuhe', slug: 'schuhe', icon: 'footprints' }
];

export const products = [
  {
    id: 1,
    name: 'Elegantes Sommerkleid',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
    category: 'damen',
    isOnSale: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Weiß', 'Schwarz', 'Navy'],
    description: 'Leichtes Sommerkleid aus atmungsaktivem Stoff, perfekt für warme Tage.'
  },
  {
    id: 2,
    name: 'Herren Business Hemd',
    price: 65.99,
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
    category: 'herren',
    isOnSale: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Weiß', 'Blau', 'Grau'],
    description: 'Klassisches Business-Hemd aus hochwertiger Baumwolle.'
  },
  {
    id: 3,
    name: 'Designer Handtasche',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1654707636800-a8f0acefaee9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGNhdGFsb2d8ZW58MHx8fHwxNzU1Njc0NzQyfDA&ixlib=rb-4.1.0&q=85',
    category: 'accessoires',
    isOnSale: false,
    sizes: ['Einheitsgröße'],
    colors: ['Grün', 'Schwarz', 'Braun'],
    description: 'Elegante Handtasche aus echtem Leder mit praktischen Fächern.'
  },
  {
    id: 4,
    name: 'Sport Sneaker',
    price: 95.99,
    originalPrice: 125.99,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcHJvZHVjdHN8ZW58MHx8fHwxNzU1Njc0NzQ4fDA&ixlib=rb-4.1.0&q=85',
    category: 'schuhe',
    isOnSale: true,
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
    colors: ['Weiß', 'Schwarz', 'Grau'],
    description: 'Bequeme Sneaker für Sport und Freizeit mit optimaler Dämpfung.'
  },
  {
    id: 5,
    name: 'Casual Jeans',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
    category: 'damen',
    isOnSale: false,
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Blue Denim', 'Black Denim', 'Light Wash'],
    description: 'Komfortable Jeans im klassischen Schnitt aus nachhaltiger Baumwolle.'
  },
  {
    id: 6,
    name: 'Luxus Sonnenbrille',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwcHJvZHVjdHN8ZW58MHx8fHwxNzU1Njc0NzQ4fDA&ixlib=rb-4.1.0&q=85',
    category: 'accessoires',
    isOnSale: false,
    sizes: ['Einheitsgröße'],
    colors: ['Schwarz', 'Braun', 'Gold'],
    description: 'Hochwertige Sonnenbrille mit UV-Schutz und polarisierten Gläsern.'
  }
];

export const heroSlides = [
  {
    id: 1,
    title: 'Neue Sommerkollektion',
    subtitle: 'Entdecken Sie die neuesten Trends',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
    ctaText: 'Jetzt Shoppen',
    ctaLink: '/products'
  },
  {
    id: 2,
    title: 'Bis zu 50% Rabatt',
    subtitle: 'Sale auf ausgewählte Artikel',
    image: 'https://images.pexels.com/photos/33507998/pexels-photo-33507998.jpeg',
    ctaText: 'Sale entdecken',
    ctaLink: '/sale'
  }
];

// Shopping Cart Mock Data
export const cartItems = [];

// User Mock Data
export const mockUser = {
  id: 1,
  name: 'Anna Müller',
  email: 'anna@example.com',
  avatar: null
};

// Featured Products für die Startseite
export const featuredProducts = products.filter(product => product.isOnSale || product.id <= 4);