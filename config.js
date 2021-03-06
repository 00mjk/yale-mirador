window.yaleMiradorSettings = {
  mirador: {
    buildPath: '/dist/mirador/',
    externalAnnotationWindowButton: true,
    annotationsOverlay: {
      showByDefault: true,
      hideUnfocused: false,
      hoverColor: 'red',
      hoverWidthFactor: 2
    },
    __tooltipStyles: {
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      border: 'solid 1px rgba(187, 187, 187, 0.5)'
    },
    __i18nOverrides: {
      en: {
        nextCanvas: 'Next Panel',
        previousCanvas: 'Previous Panel',
        showBottomPanel: 'View Panels',
        hideBottomPanel: 'Hide Panels'
      },
      ko: {
        nextCanvas: '이전 패널',
        previousCanvas: '다음 패널',
        showBottomPanel: '패널 썸네일 리스트',
        hideBottomPanel: '패널 썸네일 리스트 감추기'
      }
    }
  },
  auth: {
    isEditor: true,
    groupId: '286',
    images: {
      copyrighted: false,
      altImageService: 'http://images.tenthousandrooms.yale.edu/loris/tenkr:original/copyrighted.jpg'
    }
  },
  ui: {
    rootElementId: 'yale-mirador',
    annotationWindow: {
      continuousPages: false,
      enableDirectionToggle: true,
      hideTags: false,
      hiddenLayers: []
    }
  },
  initialLayout: {
    windows: [
      {
        type: 'imageWindow',
        manifest: 'https://s3.amazonaws.com/lifeofthebuddha.yale.edu/manifests/confucius-311.json',
        __manifest: 'https://s3.amazonaws.com/lifeofthebuddha.yale.edu/manifests/LOTB.json',
        __manifest: 'http://media.nga.gov/public/manifests/nga_highlights.json',
        __canvas: 'http://manifest.tenthousandrooms.yale.edu/node/311/canvas/14181',
        __tocTags: 'chapter4,scene1',
        __annotation: 'http://annotations.ten-thousand-rooms.yale.edu/annotations/025ce5e7-75ac-437a-9e59-6bce9b4563cd'
      },
      {
        type: 'annotationWindow',
        imageWindowIndex: 0,
        layer: 'http://mirador-annotations-lotb-stg.herokuapp.com/layers/English'
      }
    ]
  },
  annotations: {
    __store: 'http://localhost:5000',
    store: 'http://mirador-annotations-tenkr-stg.herokuapp.com',
    __store: 'http://mirador-annotations-lotb-stg.herokuapp.com',
    __tocSpec: {
      __defaultLayer: 'http://mirador-annotations-lotb-stg.herokuapp.com/layers/English',
      generator: [
        {tag: { prefix: 'chapter' }, label: { prefix: 'Chapter '}, max: 28,
        descriptions: [
          'Chapter 1. How the Bodhisattva Becomes the Divine Son Shvetaketu in Tushita<br/>དེ་ལས་དང་པོ་དགའ་ལྡན་དུ་ལྷའི་བུ་དམ་པ་ཏོག་དཀར་པོར་གྱུར་པའི་ཚུལ་ནི།',
          'Chapter 2. The Advent of an Extraordinary Lineage<br/>གཉིས་པ་རིགས་མཆོག་ཏུ་གྱུར་པ་ནི།',
          'Chapter 3. The Bodhisattva Sees the Five Sights<br/>གསུམ་པ་གཟིགས་པ་ལྔ་ལ་གཟིགས་པ་ནི།',
          'Chapter 4. The Bodhisattva Decends from Tushita into His Mother’s Womb<br/>བཞི་པ་དགའ་ལྡན་ནས་ཡུམ་གྱི་ལྷུམས་སུ་འཕོ་བ་ནི།',
          'Chapter 5. The Gestation<br/>ལྔ་པ་ལྷུམས་ན་བཞུགས་པ་ནི།',
          'Chapter 6. The Birth<br/>དྲུག་པ་སྐུ་བལྟམས་པའི་མཛད་པ་ནི།',
          'Chapter 7. Entering Kapilavastu<br/>བདུན་པ་གྲོང་ཁྱེར་སེར་སྐྱར་གཤེགས་པ་ནི།',
          'Chapter 8. The Sage Asita’s Predictions<br/>བརྒྱད་པ་དྲང་སྲོང་ཆེན་པོས་ལུང་བསྟན་པ་སོགས་ནི།',
          'Chapter 9. The Bodhisattva’s Training in the Arts<br/>དགུ་པ་བཟོའི་གནས་ལ་སྦྱངས་པ་ནི།',
          'Chapter 10. The Bodhisattva Shows his Prowess in the Martial Arts<br/>བཅུ་པ་སྒྱུ་རྩལ་གྱི་སྟོབས་བསྟན་པ་ནི།',
          'Chapter 11. Princess Yaśodharā is Selected<br/>བཅུ་གཅིག་པ་གྲགས་འཛིན་མ་ཁབ་ཏུ་གསོལ་བ་ནི།',
          'Chapter 12. The Tale of the Good-Hearted Tree<br/>བཅུ་གཉིས་པ་ཤིང་དགེ་བའི་སྙིང་པོའི་གཏམ་ནི།',
          'Chapter 13. Gopa Becomes Queen<br/>བཅུ་གསུམ་པ་ས་འཚོ་མ་བཙུན་མོར་བཞེས་པ་ནི།',
          'Chapter 14. The Events That Motivated the Prince to Renounce the World<br/>བཅུ་བཞི་བ་ངེས་པར་འབྱུང་བའི་རྐྱེན་ནི།',
          'Chapter 15. The Meditation in the Countryside<br/>བཅོ་ལྔ་པ་ཞིང་པའི་སར་བསམ་གཏན་བསྒྲུབས་པ་སོགས་ནི།',
          'Chapter 16. The Bodhisattva takes Mṛgajā in Marriage<br/>བཅུ་དྲུག་པ་བཙུན་མོ་རི་དྭགས་སྐྱེས་བ་ཞེས་པ་ནི།',
          'Chapter 17. The Imperial Guard<br/>བཅུ་བདུན་པ་སྲུང་མས་བསྐོར་བ་ནི།',
          'Chapter 18. The Bodhisattva Leaves Home<br/>བཅོ་བརྒྱད་པ་ཁྱིམ་ནས་མངོན་པར་བྱུང་བ་ནི།',
          'Chapter 19. Renunciation<br/>བཅུ་དགུ་པ་རབ་ཏུ་བྱུང་བ་ནི།',
          'Chapter 20. Searching for the Path<br/>ཉི་ཤུ་པ་ལམ་འཚོལ་བར་བསྟན་པ་ནི།',
          'Chapter 21. Practicing Austerities<br/>ཉེར་གཅིག་པ་དཀའ་བ་སྤྱད་པ་ནི།',
          'Chapter 22. Completing Austerities<br/>ཉེར་གཉིས་པ་དཀའ་ཐུབ་གྲོལ་བ་ནི།',
          'Chapter 23. Proceeding to Bodhgaya<br/>ཉེར་གསུམ་པ་བྱང་ཆུབ་སྙིང་པོར་གཤེགས་པ་ནི།',
          'Chapter 24. Subduing the Demon [Māra]<br/>ཉེར་བཞི་པ་བདུད་བཏུལ་བ་ནི།',
          'Chapter 25. The Attainment of the Unsurpassable Wisdom of Perfect Awakening<br/>ཉེར་ལྔ་པ་མངོན་པར་རྫོགས་པར་སངས་རྒྱས་པའི་བླ་ན་མེད་པའི་ཡེ་ཤེས་བརྙེས་པ་ནི།',
          'Chapter 26. Living in the Wilderness<br/>ཉེར་དྲུག་པ་ནགས་ཁྲོད་དུ་དལ་བར་བཞུགས་པ་',
          'Chapter 27. Great Brahmā Makes a Request, and [Buddha] Travels to Varanasi<br/>ཉེར་བདུན་པ་ཚངས་པ་ཆེན་པོས་གསོལ་བ་བཏབ་སྟེ་ཝཱ་རཱ་ཎ་སཱིར་གཤེགས་པ་ནི།',
          'Chapter 28. The First Turning of the Wheel<br/>ཉེར་བརྒྱད་པ་ཆོས་འཁོར་ཐོག་མ་བསྐོར་བ་ནི།'
        ]
        },
        {tag: { prefix: 'scene' },   label: { prefix: 'Scene ' },  max: 20},
        {tag: { prefix: 'p' },   label: { prefix: 'Paragraph ' },  max: 20}
      ],
      canvasMap: {
        chapter1: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter2: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter3: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter4: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter5: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter6: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter7: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter8: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter9: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter10: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter11: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter12: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter13: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter14: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter15: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter16: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter17: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter18: ['http://manifests.ydc2.yale.edu/LOTB/canvas/panel_01'],
        chapter19: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter20: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter21: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter22: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter23: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter24: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter25: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter26: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter27: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11'],
        chapter28: ['http://manifests.ydc2.yale.edu/LOTB/canvas/bv11']
      }
    }
  }
};
