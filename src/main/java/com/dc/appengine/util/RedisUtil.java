package com.dc.appengine.util;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.dc.appengine.ConfigUtil;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import sun.management.VMManagement;

public class RedisUtil {
	private static final Logger log = LoggerFactory.getLogger(RedisUtil.class);
	private static String redisIp;
	private static String redisPort;
	private static String redisAuth;
	private static Jedis jedis;
	// 可用连接实例的最大数目，默认值为8；
	// 如果赋值为-1，则表示不限制；如果pool已经分配了maxActive个jedis实例，则此时pool的状态为exhausted(耗尽)。
	private static int MAX_ACTIVE = 128;
	// 控制一个pool最多有多少个状态为idle(空闲的)的jedis实例，默认值也是8。
	private static int MAX_IDLE = 100;
	//最小空闲256个
	private static int MIN_IDLE = 4;
	// 等待可用连接的最大时间，单位毫秒，默认值为-1，表示永不超时。如果超过等待时间，则直接抛出JedisConnectionException；
	private static int MAX_WAIT = 6000;
	// 超时时间
	private static int TIMEOUT = 5000;
	// 在borrow一个jedis实例时，是否提前进行validate操作；如果为true，则得到的jedis实例均是可用的；
	private static boolean TEST_ON_BORROW = false;
	private static JedisPool jedisPool = null;
	
	//monitor method
	public static String showPoolInfo(){
		if(jedisPool!=null){
			String s1 = "used connection:"+jedisPool.getNumActive();
			String s2 = "idle connection:"+jedisPool.getNumIdle();
			log.error(s1+","+s2);
			return s1+","+s2;
		}else{
			return "error";
		}
	}
	
	/**
	 * 使用commons pool2实现的对象池，支持多线程并发取对象
	 */
	public static void init(){
		try {
			redisIp = ConfigUtil.configs.getProperty("redis.ip");
			redisPort = ConfigUtil.configs.getProperty("redis.port");
			redisAuth = ConfigUtil.configs.getProperty("redis.auth");
			JedisPoolConfig config = new JedisPoolConfig();
			config.setMaxTotal(MAX_ACTIVE);
			config.setMaxIdle(MAX_IDLE);
			config.setMinIdle(MIN_IDLE);
			config.setMaxWaitMillis(MAX_WAIT);
			config.setTestOnBorrow(TEST_ON_BORROW);
			jedisPool = new JedisPool(config, redisIp, Integer.valueOf(redisPort), TIMEOUT, redisAuth);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/*
	 * 使用该方法获取的连接需要调用returnResource(Jedis jedis)来手动归还资源，
	 * 注意需要考虑遇到异常的情况下也需要手动归还。
	 */
	public static Jedis getJedis(int index) {
		Jedis jedis = null;
		try {
			if (jedisPool != null) {
				jedis = jedisPool.getResource();
				jedis.select(index);
			}
		} catch (Exception e) {
			System.err.println("Get jedis error : " + e);
		} finally {
			//do nothing
		}
		return jedis;
	}
	
	/*
	 * 使用getNewJedis这个方法不用调用关闭方法，
	 * 因为在每完成一次操作就会取一个连接，然后使用后就归还这个连接。
	 * 已经过测试，性能没有问题。
	 * 需要注意的是redis默认配置是启动16个数据库，下标从0到15，
	 * 这里如果index大于15会有错误，暂时没处理这种问题。
	 * 使用方法：Jedis j = RedisUtil.getNewJedis(5); 然后正常调用方法即可，注意不要使用j.select()方法。
	 * 使用完毕不用调用close()。
	 */
	public static Jedis getNewJedis(int index){
		Jedis j = (Jedis)JedisProxy.getInstance(index);
		return j;
	}
	
	public static Jedis getNewJedis2(int index){
		if(redisIp==null||redisIp.equals("")){
			redisIp="127.0.0.1";
		}
		if(redisPort==null||redisPort.equals("")){
			redisPort="6379";
		}
		Jedis jedis;
		try {
			jedis=new Jedis(redisIp, Integer.valueOf(redisPort));
			jedis.auth(redisAuth);
			jedis.select(index);
		} catch (Exception e) {
			e.printStackTrace();
			jedis =null;
		}
		return jedis;
	}
	
	public static void returnResource(final Jedis jedis) {
		if(jedis != null){
			jedis.close();
		}
	}
	
	private static void initialPool() {
		try {
			JedisPoolConfig config = new JedisPoolConfig();
			config.setMaxTotal(MAX_ACTIVE);
			config.setMaxIdle(MAX_IDLE);
			config.setMaxWaitMillis(MAX_WAIT);
			config.setTestOnBorrow(TEST_ON_BORROW);
			jedisPool = new JedisPool(config, redisIp, Integer.valueOf(redisPort), TIMEOUT, redisAuth);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	/**
	 * 在多线程环境同步初始化
	 */
	private static synchronized void poolInit() {
		if (jedisPool == null) {
			initialPool();
		}
	}
	
	/*---------------下面都是测试方法，API为准--------------------*/
	/**
	 * redis存储字符串
	 */
	public void testString() {
		// -----添加数据----------
		jedis.set("name", "xinxin");// 向key-->name中放入了value-->xinxin
		System.out.println(jedis.get("name"));// 执行结果：xinxin

		jedis.append("name", " is my lover"); // 拼接
		System.out.println(jedis.get("name"));

		jedis.del("name"); // 删除某个键
		System.out.println(jedis.get("name"));
		// 设置多个键值对
		jedis.mset("name", "liuling", "age", "23", "qq", "476777XXX");
		jedis.incr("age"); // 进行加1操作
		System.out.println(jedis.get("name") + "-" + jedis.get("age") + "-"
				+ jedis.get("qq"));
		
	}

	/**
	 * redis操作Map
	 */
	
	public void testMap() {
		// -----添加数据----------
		Map<String, String> map = new HashMap<String, String>();
		map.put("name", "xinxin");
		map.put("age", "22");
		map.put("qq", "123456");
		jedis.hmset("user", map);
		// 取出user中的name，执行结果:[minxr]-->注意结果是一个泛型的List
		// 第一个参数是存入redis中map对象的key，后面跟的是放入map中的对象的key，后面的key可以跟多个，是可变参数
		List<String> rsmap = jedis.hmget("user", "name", "age", "qq");
		System.out.println(rsmap);

		// 删除map中的某个键值
		jedis.hdel("user", "age");
		System.out.println(jedis.hmget("user", "age")); // 因为删除了，所以返回的是null
		System.out.println(jedis.hlen("user")); // 返回key为user的键中存放的值的个数2
		System.out.println(jedis.exists("user"));// 是否存在key为user的记录 返回true
		System.out.println(jedis.hkeys("user"));// 返回map对象中的所有key
		System.out.println(jedis.hvals("user"));// 返回map对象中的所有value

		Iterator<String> iter = jedis.hkeys("user").iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			System.out.println(key + ":" + jedis.hmget("user", key));
		}
	}

	/**
	 * jedis操作List
	 */
	
	public void testList() {
		// 开始前，先移除所有的内容
		jedis.del("java framework");
		System.out.println(jedis.lrange("java framework", 0, -1));
		// 先向key java framework中存放三条数据
		jedis.lpush("java framework", "spring");
		jedis.lpush("java framework", "struts");
		jedis.lpush("java framework", "hibernate");
		// 再取出所有数据jedis.lrange是按范围取出，
		// 第一个是key，第二个是起始位置，第三个是结束位置，jedis.llen获取长度 -1表示取得所有
		System.out.println(jedis.lrange("java framework", 0, -1));

		jedis.del("java framework");
		jedis.rpush("java framework", "spring");
		jedis.rpush("java framework", "struts");
		jedis.rpush("java framework", "hibernate");
		System.out.println(jedis.lrange("java framework", 0, -1));
	}

	/**
	 * jedis操作Set
	 */
	
	public void testSet() {
		// 添加
		jedis.sadd("user1", "liuling");
		jedis.sadd("user1", "xinxin");
		jedis.sadd("user1", "ling");
		jedis.sadd("user1", "zhangxinxin");
		jedis.sadd("user1", "who");
		// 移除noname
		jedis.srem("user1", "who");
		System.out.println(jedis.smembers("user1"));// 获取所有加入的value
		System.out.println(jedis.sismember("user1", "who"));// 判断 who
															// 是否是user集合的元素
		System.out.println(jedis.srandmember("user1"));
		System.out.println(jedis.scard("user1"));// 返回集合的元素个数
	}

	
//	public void test() throws InterruptedException {
//		// jedis 排序
//		// 注意，此处的rpush和lpush是List的操作。是一个双向链表（但从表现来看的）
//		jedis.del("a");// 先清除数据，再加入数据进行测试
//		jedis.rpush("a", "1");
//		jedis.lpush("a", "6");
//		jedis.lpush("a", "3");
//		jedis.lpush("a", "9");
//		for (int i = 0; i < 1000; i++) {
//			int v = (int) Math.floor(Math.random() * 10000);
//			jedis.lpush("a", v + "");
//		}
//		System.out.println(jedis.lrange("a", 0, -1));// [9, 3, 6, 1]
//		System.out.println(jedis.sort("a")); // [1, 3, 6, 9] //输入排序后结果
//		System.out.println(jedis.lrange("a", 0, -1));
//	}

	/**
	 * jetis lock
	 * @throws InterruptedException
	 */
//	public void testLock(){
//		jedis.del("lock_appId");
//		String result1 = jedis.set("lock_appId", Math.random()+"", "NX", "EX", 10);//key:lock_appId,value:Math.random(),NX:不存在就创建,EX:时间单位s,time:10
//		System.out.println("lock_appId result: "+result1+"   " +  jedis.get("lock_appId"));
//		int i = 10;
//		String result ="";
//		while(i>0){
//			result = jedis.set("lock_appId", Math.random()+"", "NX", "EX", 10);
//			System.out.println(" lock_appId result: "+i+":"+ result + "   " +jedis.get("lock_appId"));
//			try {
//					Thread.sleep(1000L);
//				} catch (InterruptedException e) {
//				// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//			i--;
//		}
//		String result2 = jedis.set("lock_appId", Math.random()+"", "NX", "EX", 10);
//		System.out.println(" lock_appId result: "+result2+"   " + jedis.get("lock_appId"));
//	}

	private static Map<String,Object> lockDetail(){
		String hostIp = System.getenv("HOST_IP");
		if(StringUtils.isEmpty(hostIp)){
			throw new RuntimeException("master未设置hostIp");
		}
		int pid = jvmPid();
		int currentThread = Thread.currentThread().hashCode();
		Map<String,Object> detail = new HashMap<>();
		detail.put("host",hostIp);
		detail.put("pid",pid);
		detail.put("thread",currentThread);
		return detail;
	}
	//修改以实现可重入
	public static void lockResource(){
		String resourceLock = "resourceLock";
		Jedis j = RedisUtil.getNewJedis(5);
		if(j.exists(resourceLock)){
			//如果已经加了资源锁
			String value = j.get(resourceLock);
			Map<String,Object> detailInDB = JSON.parseObject(value,new TypeReference<Map<String, Object>>(){});
			Map<String,Object> detail = lockDetail();
			if(detailInDB.get("host").equals(detail.get("host")) && detailInDB.get("pid").equals(detail.get("pid"))
					&& detailInDB.get("thread").equals(detail.get("thread"))){
				//说明当前线程栈已经加过锁了，那就将计数器加一
				Integer count = (Integer) detailInDB.get("count");
				count ++;
				detailInDB.put("count",count);
				String str = JSON.toJSONString(detailInDB);
				j.set(resourceLock,str);
				return;
			}else{
				//当前已经加锁了，等待一下
				int i=120;//超时时间2分钟
				detail.put("count",1);
				String str = JSON.toJSONString(detail);
				while(true){
					boolean gotLock = "OK".equals(j.set(resourceLock,
							str, "NX", "EX", 3600)) ? true : false;
					if(gotLock){
						break;
					}else{
						try {
							Thread.sleep(1000L);
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
						i--;
					}
					if(i==0){
						throw new RuntimeException("资源选择等待超时...");
					}
				}
			}
		}
	}
	
	public static void releaseResourceLock(){
		String resourceLock = "resourceLock";
		Jedis j = RedisUtil.getNewJedis(5);
		if(!j.exists(resourceLock)){
			return;
		}
		String str = j.get(resourceLock);
		Map<String,Object> detailInDB = JSON.parseObject(str,new TypeReference<Map<String, Object>>(){});
		Integer count = (Integer) detailInDB.get("count");
		if(count > 1){
			count-- ;
			detailInDB.put("count",count);
			j.set(resourceLock,JSON.toJSONString(detailInDB));
		}else{
			j.del(resourceLock);
		}
	}

	public static final int jvmPid() {
		try {
			RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
			Field jvm = runtime.getClass().getDeclaredField("jvm");
			VMManagement mgmt = (VMManagement) jvm.get(runtime);
			Method pidMethod = mgmt.getClass().getDeclaredMethod("getProcessId");
			int pid = (Integer) pidMethod.invoke(mgmt);
			return pid;
		} catch (Exception e) {
			return -1;
		}
	}


}

class JedisProxy implements MethodInterceptor{
	private Enhancer enhancer;
	private Object obj;
	private int dbIndex;
	private static Map<Integer, JedisProxy> cache = new ConcurrentHashMap<>();
	
	static{
		for(int i = 0;i<16;i++){
			JedisProxy j = new JedisProxy();
			j.setDbIndex(i);
			Enhancer enhancer = new Enhancer();
			enhancer.setSuperclass(Jedis.class);
			enhancer.setCallback(j);
			Object obj = enhancer.create();
			j.setEnhancer(enhancer);
			j.setObj(obj);
			cache.put(i, j);
		}
	}
	public static Jedis getInstance(int i){
		JedisProxy jp = cache.get(i);
		Jedis fake = (Jedis) jp.getObj();
		return fake;
	}

	@Override
	public Object intercept(Object arg0, Method arg1, Object[] arg2, MethodProxy arg3) throws Throwable {
		if(arg1.getName().equals("close")){
			//System.out.println("do close");
			return null;
		}
		int dbIndex = this.dbIndex;
		Jedis real = RedisUtil.getJedis(dbIndex);
		if(real == null){
			throw new RuntimeException("redis不可用");
		}
		Object o = null;
		try {
			o = arg1.invoke(real, arg2);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			RedisUtil.returnResource(real);
		}
		return o;
	}

	public Enhancer getEnhancer() {
		return enhancer;
	}

	public void setEnhancer(Enhancer enhancer) {
		this.enhancer = enhancer;
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}

	public int getDbIndex() {
		return dbIndex;
	}

	public void setDbIndex(int dbIndex) {
		this.dbIndex = dbIndex;
	}

	public static void main(String[] args) {
		System.out.println(Thread.currentThread().hashCode());
		System.out.println(Thread.currentThread().hashCode());
	}

}
