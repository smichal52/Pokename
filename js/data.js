var adjective = 'aberrant,abnormal,abortive,abrasive,absorbed,abusive,acceptable,acrid,ad,adhesive,adventurous,agonizing,aloof,amuck,ancient,available,awesome,awful,berserk,blushing,boorish,boring,brainy,brown,certain,cheap,clammy,clear,colossal,cruel,cuddly,curious,cynical,daily,dapper,dead,delicate,deserted,direful,disagreeable,disturbed,draconian,dull,dusty,earsplitting,easy,elastic,elite,enthusiastic,exciting,exclusive,exotic,feeble,festive,fixed,flaky,foamy,frail,fresh,fretful,functional,furry,fuzzy,gaping,gaudy,goofy,gratis,great,grubby,guarded,guttural,handy,hanging,happy,hard-to-find,harmonious,heavy,helpful,hoc,hulking,husky,imminent,imported,inconclusive,industrious,inexpensive,infamous,innate,inquisitive,intelligent,interesting,irritating,itchy,juvenile,knowing,lackadaisical,laughable,lean,legal,light,long,majestic,massive,material,medical,military,miniature,miscreant,misty,mountainous,mushy,needy,neighborly,nimble,noisy,obedient,obnoxious,observant,onerous,ordinary,organic,outrageous,outstanding,overrated,overwrought,painstaking,parsimonious,perpetual,piquant,plain,polite,possessive,pricey,productive,protective,psychotic,pushy,quixotic,ratty,rebel,relieved,reminiscent,repulsive,robust,ruddy,ruthless,scintillating,seemly,selective,shallow,shiny,shocking,shrill,shy,silent,simple,slippery,special,spicy,spiritual,spurious,staking,steep,stimulating,straight,striped,strong,stupendous,succinct,swanky,swift,tan,telling,thoughtless,tiresome,towering,trite,typical,unable,unadvised,undesirable,unhealthy,uninterested,untidy,unwritten,upbeat,used,useful,vague,vast,violent,wakeful,wasteful,well-off,well-to-do,wiggly,willing,wise,wistful,wooden,zealous'.split(",");
var nature    = 'Hardy Lonely Adamant Naughty Brave Bold Docile Impish Lax RelaxedModest Mild Bashful Rash QuietCalm Gentle Careful Quirky SassyHasty Jolly Naive Serious'.split(" ");



  $('*').each(function(i,el){
    if (el.id.indexOf('google_ads_iframe') == -1) return;
    $(el).remove();
  });
  $('#site-navigation,#secondary,#comments,#colophon').remove();
  $('style').append('#main {position: absolute;top: 46px;left:0px;margin: 0;padding: 0;width: 100%;} article {width:100%}');
  /*
  #google_ads_iframe... 
  #site-navigation
  #secondary
  #comments
  #colophon
  #main {
    position: absolute;
    top: -15px;
    margin: 0;
    padding: 0;
    width: 100%;
  }
  article {width:100%}
 
 */
 