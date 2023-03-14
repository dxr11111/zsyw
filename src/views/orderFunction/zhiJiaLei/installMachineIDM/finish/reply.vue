<template>
  <!-- 回复主页面 -->
  <div class="reply">
    <MyHeader
      :name="headName"
      left="arrow-left"
      @goBackEv="goBackFn"
      @rightEv="refreshFn"
      right="replay"
    />
    <div class="posCodeSign" v-if="posCodeForceFinish == 1">
      <span>该用户设备上联POS未做二维码贴码，已选择强制回单</span>
    </div>
    <div class="main" :style="mainMarginTop">
      <van-form>
        <!-- 外包材料 -->
        <div class="region">
          <van-field
            label="外包材料"
            is-link
            arrow-direction="down"
            v-model="materialsValue"
            placeholder="请编辑外包材料"
            readonly
            @click="editMaterials"
            class="textRight borderTop"
          />
          <!-- 选择的外包材料内容 -->
          <div class="materialsContent" v-show="materialsInfo.length > 0">
            {{ materialsInfo }}
          </div>
        </div>

        <!-- 固定ip 固话悦铃 -->
        <div class="region">
          <!-- 固定IP是否施工 -->
          <div
            class="selectButton"
            v-if="IomNewFinishQuery.guDingIPtoWork == '99'"
          >
            <span class="title">固定IP</span>
            <div class="button">
              <van-button
                :type="guDingIPisWork === '0' ? 'info' : ''"
                @click="clickGuDingIPisWork(false)"
                native-type="button"
                >不施工</van-button
              >
              <van-button
                :type="guDingIPisWork === '1' ? 'info' : ''"
                @click="clickGuDingIPisWork(true)"
                native-type="button"
                >施工</van-button
              >
            </div>
          </div>
          <!-- 固定IP不施工说明 -->
          <van-field
            v-model="guDingIPisWorkDesc"
            placeholder="请输入固定IP不施工说明"
            class="borderTop borderBottom inputRegion"
            v-if="guDingIPisWork === '0'"
          />

          <!-- 固话悦铃是否施工 -->
          <div class="selectButton" v-if="IomNewFinishQuery.isyueling == '99'">
            <span class="title">固话悦铃</span>
            <div class="button">
              <van-button
                :type="isyueling === '1' ? 'info' : ''"
                @click="clickIsyueling(false)"
                native-type="button"
                >不施工</van-button
              >
              <van-button
                :type="isyueling === '0' ? 'info' : ''"
                @click="clickIsyueling(true)"
                native-type="button"
                >施工</van-button
              >
            </div>
          </div>
          <!-- 固话悦铃不施工原因 -->
          <van-field
            v-model="yuelingdesc"
            placeholder="请输入固话悦铃不施工说明"
            class="borderTop borderBottom inputRegion"
            v-if="isyueling === '1'"
          />
        </div>

        <!-- 沃家组网光猫升级 -->
        <!-- ”wifiNetGateStatus” -1：没有该服务 1：智能网关WIFI6型(显示施工不施工) 2：智能网关WIFI5型(显示施工不施工) -->
        <div
          class="selectButton region"
          v-if="listDetail.wifiNetGateStatus !== '-1'"
        >
          <span class="title">沃家组网光猫升级</span>
          <div class="button">
            <van-button
              :type="isWifiNetGateBuild === '1' ? 'info' : ''"
              @click="clickIsWifiNetGateBuild(false)"
              native-type="button"
              >不施工</van-button
            >
            <van-button
              :type="isWifiNetGateBuild === '0' ? 'info' : ''"
              @click="clickIsWifiNetGateBuild(true)"
              native-type="button"
              >施工</van-button
            >
          </div>
        </div>

        <!-- IPTV设备 -->
        <!-- iptvlist为空时，整个iptv设备都不显示 -->
        <template v-if="iptvList.length > 0">
          <div class="selectButton region">
            <span class="title"
              >IPTV设备<span>({{ iptvList.length }})</span></span
            >
            <!-- ”isIptvAdd”  1加装(显示IPTV施工不施工按钮)，0不加装 -->
            <div class="button" v-if="listDetail.isIptvAdd === '1'">
              <van-button
                :type="iptvUnworkedFlag === '1' ? 'info' : ''"
                @click="clickIptvUnworkedFlag(false)"
                native-type="button"
                >不施工</van-button
              >
              <van-button
                :type="iptvUnworkedFlag === '0' ? 'info' : ''"
                @click="clickIptvUnworkedFlag(true)"
                native-type="button"
                >施工</van-button
              >
            </div>
          </div>
          <!-- iptv设备信息-iptvUnworkedFlag:1：未施工 ，0：施工 -->
          <template v-if="iptvUnworkedFlag === '0'">
            <div class="deviceList">
              <div
                class="item"
                v-for="(item, index) in iptvList"
                :key="index"
                @click="clickIptvItem(index)"
              >
                <div class="left">
                  <div class="num">{{ index + 1 }}</div>
                  <div class="content">
                    <div class="title">
                      <span>产品编号：{{ item.iptvProdId }}</span>
                      <span>账号：{{ item.iptvNumber }}</span>
                      <template v-if="item.televisionCore">
                        <span>电视芯串码：{{ item.televisionCore }}</span>
                      </template>
                      <template v-else>
                        <span>机顶盒ID：{{ item.iptvBoxId }}</span>
                        <span>机顶盒MAC：{{ item.iptvMac }}</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- iptv不施工的原因 -->
          <template v-else>
            <van-field
              label="IPTV不施工原因"
              :value="iptvUnworkedBackReason"
              @click="iptvUnworkedBackReasonShow = true"
              is-link
              arrow-direction="down"
              readonly
              placeholder="请选择"
              class="textRight"
            />
            <van-action-sheet
              v-model="iptvUnworkedBackReasonShow"
              :actions="iptvUnworkedBackReasonActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectIptvUnworkedBackReason"
            />
          </template>
        </template>

        <!-- 皮基站设备 -->
        <template v-if="pjzList.length > 0">
          <div class="selectButton">
            <span class="title">
              皮基站设备
              <span>({{ pjzList.length }})</span>
            </span>
          </div>
          <!-- 皮基站设备信息 -->
          <div class="deviceList">
            <div
              class="item"
              v-for="(item, index) in pjzList"
              :key="index"
              @click="clickPjzItem(index)"
            >
              <div class="left">
                <div class="num">{{ index + 1 }}</div>
                <div class="content">
                  <div class="title">
                    <span>产品标识：{{ item.prodId }}</span>
                    <span>产品名称：{{ item.prodName }}</span>
                    <span>SN：{{ item.sn }}</span>
                    <span>MAC：{{ item.mac }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- OTT设备 -->
        <template v-if="ottList.length > 0">
          <div class="selectButton">
            <span class="title">
              OTT设备
              <span>({{ ottList.length }})</span>
            </span>
          </div>
          <!-- ott设备信息 -->
          <div class="deviceList">
            <div
              class="item"
              v-for="(item, index) in ottList"
              :key="index"
              @click="clickOttItem(index)"
            >
              <div class="left">
                <div class="num">{{ index + 1 }}</div>
                <div class="content">
                  <div class="title">
                    <span>附属产品标识：{{ item.prodId }}</span>
                    <span>SN：{{ item.sn }}</span>
                    <span>MAC：{{ item.mac }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <h3 class="wjcp">沃家产品设备</h3>
        <!-- 沃油器 -->
        <template v-if="wjcpList.length > 0">
          <div class="selectButton">
            <span class="title">
              沃油器
              <span>({{ wjcpList.length }})</span>
            </span>
          </div>
          <!-- 沃油器设备信息 -->
          <div class="deviceList">
            <div
              class="item"
              v-for="(item, index) in wjcpList"
              :key="index"
              @click="clickWjcpItem(index)"
            >
              <div class="left">
                <div class="num">{{ index + 1 }}</div>
                <div class="content">
                  <div class="title">
                    <span>SN：{{ item.sn }}</span>
                    <span>MAC：{{ item.mac }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- wifi产品设备 -->
        <template>
          <div class="selectButton">
            <span class="title">
              wifi产品设备
              <span>({{ wifiList.length }})</span>
            </span>
          </div>
          <!-- wifi产品设备信息 -->
          <div class="deviceList" v-if="IomNewFinishQuery.isHaveWifiList === 1">
            <div
              class="item"
              v-for="(item, index) in wifiList"
              :key="index"
              @click="clickWifiItem(index)"
            >
              <div class="left">
                <div class="num">{{ index + 1 }}</div>
                <div class="content">
                  <div class="title">
                    <span>设备类型：{{ item.wifiTermModel }}</span>
                    <span>终端提供方式：{{ item.wifiTermType }}</span>
                    <template
                      v-if="
                        item.isRecycleDevice === '-1' ||
                        item.isRecycleDevice === '0'
                      "
                    >
                      <span>旧SN：{{ item.oldsn }}</span>
                      <span>旧MAC：{{ item.oldmac }}</span>
                      <span>新SN：{{ item.sn }}</span>
                      <span>新MAC：{{ item.mac }}</span>
                    </template>
                    <template
                      v-else-if="
                        item.isRecycleDevice === '1' ||
                        item.isRecycleDevice === ''
                      "
                    >
                      <span>SN：{{ item.sn }}</span>
                      <span>MAC：{{ item.mac }}</span>
                    </template>
                  </div>
                </div>
              </div>
              <div class="right">
                <span v-if="item.isWifiBuild === '0'">√施工</span>
                <span v-else>×未施工</span>
              </div>
            </div>
          </div>
          <!-- 请选择wifi设备 -->
          <template v-else>
            <van-field
              label="WIFI能力"
              :value="wifiAbilityName"
              @click="wifiAbilityShow = true"
              is-link
              arrow-direction="down"
              readonly
              placeholder="请选择"
              class="textRight"
            />
            <van-action-sheet
              v-model="wifiAbilityShow"
              :actions="wifiAbilityActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectWifiAbility"
            />
          </template>
          <!-- 用户终端型号 -->
          <div class="region" v-if="ability !== '' && ability !== '0'">
            <van-field
              v-model="resModelName"
              label="终端型号"
              placeholder="请输入用户终端型号（必填）"
              class="borderTop borderBottom inputRegion"
            />
          </div>
        </template>

        <!-- FTTR从设备 -->
        <!-- fttr设备为空时，整个fttr部分都不显示 -->
        <template v-if="postData.fttrInfo.length > 0">
          <!-- 选择是否施工 -->
          <div class="selectButton">
            <span class="title">
              FTTR从设备
              <span>({{ postData.fttrInfo.length }})</span>
            </span>
            <!-- 4.“isFttrSelect”   判断FTTR设备是否可选施工 1-可选（显示施工不施工）   0-不可选 -->
            <div class="button" v-if="listDetail.isFttrSelect === '1'">
              <van-button
                :type="isFttrBuild === '0' ? 'info' : ''"
                @click="clickIsFttrBuild(false)"
                native-type="button"
                >不施工</van-button
              >
              <van-button
                :type="isFttrBuild === '1' ? 'info' : ''"
                @click="clickIsFttrBuild(true)"
                native-type="button"
                >施工</van-button
              >
            </div>
          </div>
          <!-- FTTR从设备施工 -默认状态和施工状态显示 -->
          <template v-if="isFttrBuild === '1' || isFttrBuild === ''">
            <!-- 请点击查询用户主从FTTR设备信息 -->
            <div class="selectButton">
              <span class="title"> 请点击查询用户主从FTTR设备信息 </span>
              <!-- 4.“isFttrSelect”   判断FTTR设备是否可选施工 1-可选（显示施工不施工）   0-不可选 -->
              <div class="button">
                <van-button
                  type="info"
                  @click="queryDevice"
                  native-type="button"
                  >查询主从设备</van-button
                >
              </div>
            </div>
            <!-- 施工布线 -->
            <van-field
              label="施工布线"
              :value="fttrBuildWiring"
              @click="fttrBuildWiringShow = true"
              is-link
              arrow-direction="down"
              readonly
              placeholder="请选择"
              class="textRight"
            />
            <van-action-sheet
              v-model="fttrBuildWiringShow"
              :actions="fttrBuildWiringActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectFttrBuildWiring"
            />
            <div class="deviceList">
              <div
                class="item"
                v-for="(item, index) in postData.fttrInfo"
                :key="index"
                @click="clickFttrItem(index)"
              >
                <div class="left">
                  <div class="num">{{ index + 1 }}</div>
                  <div class="content">
                    <div class="title">
                      <span
                        >业务类型：{{
                          item.actType === "A" ? "新装" : "换机"
                        }}</span
                      >
                      <!-- 新装显示内容 -->
                      <template v-if="item.actType === 'A'">
                        <span>SN：{{ item.sn }}</span>
                        <span>MAC：{{ item.mac }}</span>
                      </template>
                      <!-- 换机显示内容 -->
                      <template v-else>
                        <span>旧SN：{{ item.oldSn }}</span>
                        <span>旧MAC：{{ item.oldMac }}</span>
                        <span>新SN：{{ item.sn }}</span>
                        <span>新MAC：{{ item.mac }}</span>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <div class="selectButton">
                    <div class="button">
                      <van-button
                        :type="
                          postData.fttrInfo[index].isFttrBuild === '1'
                            ? 'info'
                            : ''
                        "
                        @click.stop="clickFttrInfoIsFttrBuild(false, index)"
                        native-type="button"
                        >{{ item.actType === "A" ? "装" : "换" }}</van-button
                      >
                      <van-button
                        :type="
                          postData.fttrInfo[index].isFttrBuild === '0'
                            ? 'info'
                            : ''
                        "
                        @click.stop="clickFttrInfoIsFttrBuild(true, index)"
                        native-type="button"
                        >{{
                          item.actType === "A" ? "不装" : "不换"
                        }}</van-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- 神眼 -->
        <!-- “isShenYanInstall”  1加装（显示神眼操作不操作按钮），0不加装 -->
        <div class="selectButton" v-if="listDetail.isShenYanInstall === '1'">
          <span class="title">神眼</span>
          <div class="button">
            <van-button
              :type="isShenYanBuild === '1' ? 'info' : ''"
              @click="clickIsShenYanBuild(false)"
              native-type="button"
              >不操作</van-button
            >
            <van-button
              :type="isShenYanBuild === '0' ? 'info' : ''"
              @click="clickIsShenYanBuild(true)"
              native-type="button"
              >操作</van-button
            >
          </div>
        </div>
        <!-- 神眼不操作描述 -->
        <van-field
          v-model="shenYanDesc"
          placeholder="请输入不操作神眼描述（选填）"
          class="borderTop borderBottom inputRegion"
          v-if="isShenYanBuild === '1'"
        />

        <!-- 看家服务-室内摄像头、室外枪机、智能门铃 -->
        <div
          class="equRegion"
          v-for="(equ, equIndex) in allEqu"
          :key="equIndex"
        >
          <div class="selectButton">
            <span class="title">{{ equ.allName }}</span>
          </div>
          <!-- 设备信息 -->
          <div class="deviceList">
            <div
              class="item"
              v-for="(item, index) in equ.equipmentList"
              :key="index"
              @click="clickEquItem(equIndex, index)"
            >
              <div class="left">
                <div class="num">{{ index + 1 }}</div>
                <div class="content">
                  <div class="title">
                    <span
                      >业务类型：{{
                        item.actType === "A" ? "新装" : "新旧"
                      }}</span
                    >
                    <span>附属产品标识：{{ item.prodId }}</span>
                    <span>附属产品名称：{{ item.prodName }}</span>
                    <span v-if="item.isBuild === '0'" class="equReason"
                      >原因：{{ item.equipmentDesc }}</span
                    >
                    <template v-else>
                      <!-- 新装 -->
                      <template v-if="item.actType === 'A'">
                        <span>SN：{{ item.sn }}</span>
                        <span>MAC：{{ item.mac }}</span>
                      </template>
                      <!-- 新旧 -->
                      <template v-else-if="item.actType === 'X'">
                        <span>旧SN：{{ item.oldSn }}</span>
                        <span>旧MAC：{{ item.oldMac }}</span>
                        <span>新SN：{{ item.sn }}</span>
                        <span>新MAC：{{ item.mac }}</span>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="selectButton">
                  <div class="button">
                    <van-button
                      :type="item.isBuild === '1' ? 'info' : ''"
                      @click.stop="
                        clickEquipmentListIsBuild(true, equIndex, index)
                      "
                      native-type="button"
                      >{{ item.actType === "A" ? "装" : "换" }}</van-button
                    >
                    <van-button
                      :type="item.isBuild === '0' ? 'info' : ''"
                      @click.stop="
                        clickEquipmentListIsBuild(false, equIndex, index)
                      "
                      native-type="button"
                      >{{ item.actType === "A" ? "不装" : "不换" }}</van-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 回单备注 -->
        <div class="region">
          <van-field
            v-model="remark"
            label="回单备注"
            placeholder="请输入回单备注（选填）"
            class="borderTop borderBottom inputRegion"
          />
        </div>
        <!-- 发起掌沃通测试 -->
        <div class="region">
          <!-- 控制行政区域是否显示 -->
          <template v-if="IomNewFinishQuery.isAreaCode === '1'">
            <p class="tips1">该工单地址未匹配到行政区，请手工选择行政区</p>
            <van-field
              label="行政区"
              :value="areaCodeName"
              @click="areaCodeShow = true"
              is-link
              arrow-direction="down"
              readonly
              placeholder="选择行政区"
              class="textRight"
            />
            <van-action-sheet
              v-model="areaCodeShow"
              :actions="areaCodeActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectAreaCode"
            />
          </template>
          <!-- 控制发起测速区域是否显示 -->
          <template v-if="IomNewFinishQuery.speedFormButtonFlag == '1'">
            <p class="tips2">先发起测速后，到联通公众进行测速再回单</p>
            <div style="padding: 10px 30px">
              <van-button
                round
                block
                type="info"
                native-type="button"
                @click="speedForm"
                >发起测速</van-button
              >
            </div>
          </template>
        </div>
        <!-- 测速平台 -->
        <div class="region" v-if="IomNewFinishQuery.speedFlag === 2">
          <h4>测速平台</h4>
          <p class="forcedReceiptTips">
            当前未测速或测速结果不达标，需填写强制回单内容
          </p>
          <van-field
            label="原因"
            :value="iom_TestRate_ReasonInfo"
            @click="iom_TestRateShow = true"
            is-link
            arrow-direction="down"
            readonly
            placeholder="请选择"
            class="textRight"
          />
          <van-action-sheet
            v-model="iom_TestRateShow"
            :actions="iom_TestRateActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectIomTestRate"
          />
          <!-- 强制回单说明-原因选其他时出现 -->
          <van-field
            v-if="iom_TestRate_ReasonID === '5'"
            v-model="iomTestRateExplain"
            label="说明"
            placeholder="请输入强制回单说明（必填）"
            class="borderTop borderBottom inputRegion"
          />
        </div>

        <!-- ONU收光率 -->
        <div class="region" v-if="IomNewFinishQuery.reasonLosFlag === 2">
          <h4>ONU收光率</h4>
          <p class="forcedReceiptTips">
            当前未测光功率或光功率不达标，需填写强制回单内容
          </p>
          <p class="reasonTestLos">
            收光功率：{{ IomNewFinishQuery.reasonTestLos }}
          </p>
          <van-field
            label="原因"
            :value="iom_TestRate_LosInfo"
            @click="iom_TestRate_LosShow = true"
            is-link
            arrow-direction="down"
            readonly
            placeholder="请选择"
            class="textRight"
          />
          <van-action-sheet
            v-model="iom_TestRate_LosShow"
            :actions="iom_TestRate_LosActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectIomTestRateLos"
          />
        </div>
        <!-- 光猫WIFI测速 -->
        <div class="region">
          <h4>光猫WIFI测速</h4>
          <p class="forcedReceiptTips">
            当前WIFI未测速或测速结果不达标，需填写强制回单内容
          </p>
          <van-field
            label="原因"
            :value="wifiBackResonInfo"
            @click="wifiBackShow = true"
            is-link
            arrow-direction="down"
            readonly
            placeholder="请选择"
            class="textRight"
          />
          <van-action-sheet
            v-model="wifiBackShow"
            :actions="wifiBackActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectWifiBack"
          />
        </div>
        <!-- LAN口协商速率 -->
        <!-- lanStatus:-1,LAN口协商区域不显示 -->
        <div class="region" v-if="IomNewFinishQuery.lanStatus !== '-1'">
          <h4>LAN口协商速率</h4>
          <!-- lanStatus:1 未测速 -->
          <div class="againSpeed" v-if="IomNewFinishQuery.lanStatus == '1'">
            <div class="left">
              <p class="tips1">LAN协商速率，请先测速。</p>
              <p class="tips1">未测速，禁止回单</p>
            </div>
            <div class="right">
              <van-button type="info" @click="LanInQuire">测速</van-button>
            </div>
          </div>
          <!-- lanStatus:2 已测速，无结果 -->
          <div class="againSpeed" v-if="IomNewFinishQuery.lanStatus == '2'">
            <div class="left">
              <p class="tips1">已发起测速，请点击右上角刷新按钮获取最新结果</p>
              <p class="tips1">未收到测速结果，禁止回单。</p>
            </div>
            <div class="right">
              <van-button type="info" style="padding: 5px" @click="LanInQuire"
                >重新测速</van-button
              >
            </div>
          </div>
          <!-- lanStatus:3 测速失败 -->
          <div
            class="againSpeed"
            v-else-if="IomNewFinishQuery.lanStatus == '3'"
          >
            <div class="left">
              <p class="tips1">LAN速率结果不达标，需填写强制回单内容</p>
              <p class="tips2">*可以再次发起重新测速，获取最新结果</p>
            </div>
            <div class="right">
              <van-button type="info" @click="LanInQuire">重新测速</van-button>
            </div>
          </div>
          <!-- lanStatus:4 测速成功 -->
          <div class="againSpeed" v-if="IomNewFinishQuery.lanStatus == '4'">
            <div class="left">
              <p>LAN口测速结果已达标，LAN口数据如下。</p>
            </div>
          </div>
          <!-- lanStatus:5 异常 -->
          <div class="againSpeed" v-if="IomNewFinishQuery.lanStatus == '5'">
            <div class="left">
              <p class="tips1">未检测到LAN速率，禁止回单，请测速</p>
            </div>
            <div class="right">
              <van-button type="info" @click="LanInQuire">测速</van-button>
            </div>
          </div>
          <template
            v-if="
              IomNewFinishQuery.lanStatus == '3' ||
              IomNewFinishQuery.lanStatus == '5'
            "
          >
            <van-field
              label="原因"
              :value="lanRateReasonInfo"
              @click="lanRateReasonShow = true"
              is-link
              arrow-direction="down"
              readonly
              placeholder="请选择"
              class="textRight"
            />
            <van-action-sheet
              v-model="lanRateReasonShow"
              :actions="lanRateReasonActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectLanRateReason"
            />
            <van-field
              v-model="lanRateDesc"
              label="说明"
              placeholder="请输入强制回单说明（必填）"
              class="borderTop borderBottom inputRegion"
            />
          </template>

          <!-- LAN表格 -->
          <table
            class="LAN"
            v-if="
              IomNewFinishQuery.lanStatus == '3' ||
              IomNewFinishQuery.lanStatus == '4' ||
              IomNewFinishQuery.lanStatus == '5'
            "
          >
            <tr>
              <td>LAN1</td>
              <td>LAN2</td>
              <td>LAN3</td>
              <td>LAN4</td>
            </tr>
            <tr>
              <td>{{ IomNewFinishQuery.lan1 }}</td>
              <td>{{ IomNewFinishQuery.lan2 }}</td>
              <td>{{ IomNewFinishQuery.lan3 }}</td>
              <td>{{ IomNewFinishQuery.lan4 }}</td>
            </tr>
          </table>
        </div>
        <!-- 组网WIFI设备测速,wifi产品设备选择不施工则隐藏 -->
        <div
          class="region wifiZW"
          v-if="hideWifiZWRegion && IomNewFinishQuery.wifiZwStatus !== '0'"
        >
          <!-- 0：无需测速 -->
          <h4>组网WIFI设备测速</h4>
          <!-- 1：未测速-有按钮 -->
          <div class="againSpeed" v-if="IomNewFinishQuery.wifiZwStatus === '1'">
            <div class="left">
              <p class="tips1">还未测速，请发起测速后，再回单</p>
            </div>
            <div class="right">
              <van-button type="info" @click="WifiVm">发起测速</van-button>
            </div>
          </div>
          <!-- 2：测速中 -->
          <div
            class="againSpeed"
            v-else-if="IomNewFinishQuery.wifiZwStatus === '2'"
          >
            <p>测速中，请耐心等待</p>
          </div>
          <!-- 3：测速达标 -->
          <div
            class="againSpeed"
            v-else-if="IomNewFinishQuery.wifiZwStatus === '3'"
          >
            <p style="color: #39f923">测速已达标</p>
          </div>
          <!-- 4：测速未达标 -->
          <div
            class="againSpeed"
            v-else-if="IomNewFinishQuery.wifiZwStatus === '4'"
          >
            <div class="left">
              <p class="tips1">测速未达标，可再次发起测速或直接强制回单</p>
            </div>
            <div class="right">
              <van-button type="info" @click="WifiVm">发起测速</van-button>
            </div>
          </div>

          <!-- 组网级别及组网速率部分-3,4 -->
          <template
            v-if="
              IomNewFinishQuery.wifiZwStatus === '3' ||
              IomNewFinishQuery.wifiZwStatus === '4'
            "
          >
            <van-cell
              title="WIFI组网级别："
              value=""
              v-if="IomNewFinishQuery.wifiZwModel === ''"
            />
            <van-cell
              title="WIFI组网级别："
              value="黄金"
              v-if="IomNewFinishQuery.wifiZwModel === '1'"
            />
            <van-cell
              title="WIFI组网级别："
              value="白金"
              v-if="
                IomNewFinishQuery.wifiZwModel === '2' ||
                IomNewFinishQuery.wifiZwModel === '3'
              "
            />
            <van-cell
              title="WIFI组网级别："
              value="钻石"
              v-if="IomNewFinishQuery.wifiZwModel === '4'"
            />
            <van-cell
              title="WIFI组网速率："
              :value="IomNewFinishQuery.wifiZwVal + 'MB'"
            />
          </template>
          <!-- 选择强制回单原因部分-2,4 -->
          <template
            v-if="
              IomNewFinishQuery.wifiZwStatus === '2' ||
              IomNewFinishQuery.wifiZwStatus === '4'
            "
          >
            <van-field
              label="原因"
              :value="wifiZwBackResonInfo"
              @click="wifiZwBackShow = true"
              is-link
              arrow-direction="down"
              readonly
              placeholder="请选择"
              class="textRight"
            />
            <van-action-sheet
              v-model="wifiZwBackShow"
              :actions="wifiZwBackActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectWifiZwBack"
            />
            <van-field
              v-model="wifiZwBackExplain"
              label="说明"
              placeholder="请输入强制回单说明（必填）"
              class="borderTop borderBottom inputRegion"
            />
          </template>

          <div class="viewWifiNorm">
            <span @click="wifiRateNormPopShow = true">查看wifi标准</span>
          </div>
        </div>

        <!-- lanStatus=1/2;wifiZwStatus=1时 按钮置灰 -->

        <div style="padding: 30px">
          <van-button
            round
            block
            native-type="submit"
            style="background-color: grey; color: #fff"
            @click="putAsh"
            v-if="
              IomNewFinishQuery.lanStatus == '1' ||
              IomNewFinishQuery.lanStatus == '2' ||
              IomNewFinishQuery.wifiZwStatus == '1'
            "
            >确定</van-button
          >
          <van-button
            round
            block
            type="info"
            native-type="submit"
            @click="judgeFinish"
            v-else
            >确定</van-button
          >
        </div>
      </van-form>
      <!-- iptv设备信息弹层 -->
      <van-popup
        v-model="iptvPopShow"
        class="devPop"
        v-if="iptvPopIndex !== -1"
        @click-overlay="cancelIptvPop"
        :close-on-click-overlay="false"
      >
        <h3>IPTV设备信息</h3>
        <!-- 终端设备-电视芯 -->
        <div class="isTelevisionCoreButton">
          <div class="button">
            <van-button
              :type="
                postData.iptvInfoList[iptvPopIndex].isTelevisionCore === '1'
                  ? 'info'
                  : ''
              "
              @click="clickIsTelevisionCore(true)"
              native-type="button"
              >终端设备</van-button
            >
            <van-button
              :type="
                postData.iptvInfoList[iptvPopIndex].isTelevisionCore === '0'
                  ? 'info'
                  : ''
              "
              @click="clickIsTelevisionCore(false)"
              native-type="button"
              >电视芯</van-button
            >
          </div>
        </div>
        <div class="scanRegion">
          <template
            v-if="postData.iptvInfoList[iptvPopIndex].isTelevisionCore === '1'"
          >
            <van-field
              v-model="postData.iptvInfoList[iptvPopIndex].iptvStbid"
              right-icon="scan"
              placeholder="请输入机顶盒ID"
            />
            <van-field
              v-model="postData.iptvInfoList[iptvPopIndex].iptvMac"
              right-icon="scan"
              placeholder="请输入机顶盒MAC"
            />
            <!-- 请选择设备好坏 -->
            <div class="selectButton">
              <span class="title">请选择设备好坏</span>
              <div class="button">
                <van-button
                  :type="
                    postData.iptvInfoList[iptvPopIndex].isBreak === 1
                      ? 'info'
                      : ''
                  "
                  @click="clickIptvInfoListIsBreak(true)"
                  native-type="button"
                  >好</van-button
                >
                <van-button
                  :type="
                    postData.iptvInfoList[iptvPopIndex].isBreak === 2
                      ? 'info'
                      : ''
                  "
                  @click="clickIptvInfoListIsBreak(false)"
                  native-type="button"
                  >坏</van-button
                >
              </div>
            </div>
          </template>
          <template v-else>
            <van-field
              v-model="postData.iptvInfoList[iptvPopIndex].televisionCore"
              right-icon="scan"
              placeholder="请输入电视芯串码"
            />
          </template>
        </div>
        <div class="buttonRegion">
          <van-button type="info" @click="cancelIptvPop">取消</van-button>
          <van-button type="info" @click="confirmIptvPop">确认</van-button>
        </div>
      </van-popup>
      <!-- 皮基站设备信息弹出层 -->
      <van-popup
        v-model="pjzPopShow"
        class="devPop"
        v-if="pjzPopIndex !== -1"
        @click-overlay="cancelPjzPop"
        :close-on-click-overlay="false"
      >
        <h3>皮基站设备信息</h3>
        <div class="scanRegion">
          <van-field
            v-model="postData.pjzList[pjzPopIndex].sn"
            right-icon="scan"
            placeholder="请输入SN"
          />
          <van-field
            v-model="postData.pjzList[pjzPopIndex].mac"
            right-icon="scan"
            placeholder="请输入MAC"
          />
        </div>
        <div class="buttonRegion">
          <van-button type="info" @click="cancelPjzPop">取消</van-button>
          <van-button type="info" @click="confirmPjzPop">确认</van-button>
        </div>
      </van-popup>
      <!-- ott设备信息弹出层 -->
      <van-popup
        v-model="ottPopShow"
        class="devPop"
        v-if="ottPopIndex !== -1"
        @click-overlay="cancelOttPop"
        :close-on-click-overlay="false"
      >
        <h3>OTT设备信息</h3>
        <div class="scanRegion">
          <van-field
            v-model="postData.ottList[ottPopIndex].sn"
            right-icon="scan"
            placeholder="请输入SN"
          />
          <van-field
            v-model="postData.ottList[ottPopIndex].mac"
            right-icon="scan"
            placeholder="请输入MAC"
          />
        </div>
        <div class="buttonRegion">
          <van-button type="info" @click="cancelOttPop">取消</van-button>
          <van-button type="info" @click="confirmOttPop">确认</van-button>
        </div>
      </van-popup>
      <!-- fttr设备信息弹出层 -->
      <van-popup
        v-model="fttrPopShow"
        class="devPop"
        v-if="fttrPopIndex !== -1"
        @click-overlay="cancelFttrPop"
        :close-on-click-overlay="false"
      >
        <h3>FTTR从设备信息</h3>
        <div class="scanRegion">
          <!-- 装机 -->
          <template v-if="postData.fttrInfo[fttrPopIndex].actType === 'A'">
            <van-field
              v-model="postData.fttrInfo[fttrPopIndex].sn"
              right-icon="scan"
              placeholder="请输入或扫描设备SN（必填）"
            />
            <van-field
              v-model="postData.fttrInfo[fttrPopIndex].mac"
              right-icon="scan"
              placeholder="请输入或扫描设备MAC（必填）"
            />
          </template>
          <!-- 换机 -->
          <template v-else>
            <van-field
              v-model="postData.fttrInfo[fttrPopIndex].oldSn"
              right-icon="scan"
              placeholder="请输入或扫描旧设备SN（必填）"
            />
            <van-field
              v-model="postData.fttrInfo[fttrPopIndex].oldMac"
              right-icon="scan"
              placeholder="请输入或扫描旧设备MAC（必填）"
            />
            <van-field
              v-model="postData.fttrInfo[fttrPopIndex].sn"
              right-icon="scan"
              placeholder="请输入或扫描新设备SN（必填）"
            />
            <van-field
              v-model="postData.fttrInfo[fttrPopIndex].mac"
              right-icon="scan"
              placeholder="请输入或扫描新设备MAC（必填）"
            />
          </template>
        </div>
        <div class="buttonRegion">
          <van-button type="info" @click="cancelFttrPop">取消</van-button>
          <van-button type="info" @click="confirmFttrPop">确认</van-button>
        </div>
      </van-popup>
      <!-- 沃由器设备信息弹层 -->
      <van-popup
        v-model="wjcpPopShow"
        class="devPop"
        v-if="wjcpPopIndex !== -1"
        @click-overlay="cancelWjcpPop"
        :close-on-click-overlay="false"
      >
        <h3>沃由器设备信息</h3>

        <div class="scanRegion">
          <van-field
            v-model="wjcpList[wjcpPopIndex].sn"
            right-icon="scan"
            placeholder="请输入SN"
          />
          <van-field
            v-model="wjcpList[wjcpPopIndex].mac"
            right-icon="scan"
            placeholder="请输入MAC"
          />
          <!-- 请选择设备好坏 -->
          <div class="selectButton">
            <span class="title">请选择设备好坏</span>
            <div class="button">
              <van-button
                :type="wjcpList[wjcpPopIndex].isBreak === 1 ? 'info' : ''"
                @click="clickWjcpListIsBreak(true)"
                native-type="button"
                >好</van-button
              >
              <van-button
                :type="wjcpList[wjcpPopIndex].isBreak === 2 ? 'info' : ''"
                @click="clickWjcpListIsBreak(false)"
                native-type="button"
                >坏</van-button
              >
            </div>
          </div>
        </div>
        <div class="buttonRegion">
          <van-button type="info" @click="cancelWjcpPop">取消</van-button>
          <van-button type="info" @click="confirmWjcpPop">确认</van-button>
        </div>
      </van-popup>
      <!-- wifi设备信息弹层 -->
      <van-popup
        v-model="wifiPopShow"
        class="devPop"
        v-if="wifiPopIndex !== -1"
        @click-overlay="cancelWifiPop"
        :close-on-click-overlay="false"
      >
        <h3>WIFI设备信息</h3>
        <div class="wifiTips">
          多个WIFI设备时，需同时选择施工或不施工，系统将自动设置其他WIFI设备的施工状态
        </div>
        <!-- 是否施工 -->
        <div class="selectButton">
          <span class="title">是否施工</span>
          <div class="button">
            <van-button
              :type="wifiList[wifiPopIndex].isWifiBuild === '0' ? 'info' : ''"
              @click="clickWifiListIsWifiBuild(true)"
              native-type="button"
              >施工</van-button
            >
            <van-button
              :type="wifiList[wifiPopIndex].isWifiBuild === '1' ? 'info' : ''"
              @click="clickWifiListIsWifiBuild(false)"
              native-type="button"
              >不施工</van-button
            >
          </div>
        </div>
        <div class="scanRegion">
          <!-- 选择施工 -->
          <template v-if="wifiList[wifiPopIndex].isWifiBuild === '0'">
            <van-field
              v-model="wifiList[wifiPopIndex].sn"
              right-icon="scan"
              placeholder="请输入新SN"
            />
            <van-field
              v-model="wifiList[wifiPopIndex].mac"
              right-icon="scan"
              placeholder="请输入新MAC"
            />
            <!-- 请选择设备好坏 -->
            <div class="selectButton">
              <span class="title">请选择设备好坏</span>
              <div class="button">
                <van-button
                  :type="wifiList[wifiPopIndex].isBreak === 1 ? 'info' : ''"
                  @click="clickWifiListIsBreak(true)"
                  native-type="button"
                  >好</van-button
                >
                <van-button
                  :type="wifiList[wifiPopIndex].isBreak === 2 ? 'info' : ''"
                  @click="clickWifiListIsBreak(false)"
                  native-type="button"
                  >坏</van-button
                >
              </div>
            </div>
          </template>
          <!-- 选择不施工 -->
          <template v-else>
            <van-field
              v-model="wifiList[wifiPopIndex].wifiDescribe"
              placeholder="请输入wifi不施工原因"
            />
          </template>
        </div>
        <div class="buttonRegion">
          <van-button type="info" @click="cancelWifiPop">取消</van-button>
          <van-button type="info" @click="confirmWifiPop">确认</van-button>
        </div>
      </van-popup>
      <!-- 看家服务设备信息弹出层 -->
      <van-popup
        v-model="equPopShow"
        class="devPop"
        v-if="allEquPopIndex !== -1"
        @click-overlay="cancelEquPop"
        :close-on-click-overlay="false"
      >
        <h3>{{ allEqu[allEquPopIndex].allName }}</h3>
        <!-- 装/换 -->
        <template
          v-if="
            allEqu[allEquPopIndex].equipmentList[equPopIndex].isBuild === '1'
          "
        >
          <div class="scanRegion">
            <!-- 装 -->
            <template
              v-if="
                allEqu[allEquPopIndex].equipmentList[equPopIndex].actType ===
                'A'
              "
            >
              <van-field
                v-model="allEqu[allEquPopIndex].equipmentList[equPopIndex].sn"
                right-icon="scan"
                placeholder="请输入或扫描设备SN（必填）"
              />
              <van-field
                v-model="allEqu[allEquPopIndex].equipmentList[equPopIndex].mac"
                right-icon="scan"
                placeholder="请输入或扫描设备MAC（必填）"
              />
            </template>
            <!-- 换 -->
            <template v-else>
              <van-field
                v-model="
                  allEqu[allEquPopIndex].equipmentList[equPopIndex].oldSn
                "
                right-icon="scan"
                placeholder="请输入或扫描设备旧SN（必填）"
              />
              <van-field
                v-model="
                  allEqu[allEquPopIndex].equipmentList[equPopIndex].oldMac
                "
                right-icon="scan"
                placeholder="请输入或扫描设备旧MAC（必填）"
              />
              <van-field
                v-model="allEqu[allEquPopIndex].equipmentList[equPopIndex].sn"
                right-icon="scan"
                placeholder="请输入或扫描设备新SN（必填）"
              />
              <van-field
                v-model="allEqu[allEquPopIndex].equipmentList[equPopIndex].mac"
                right-icon="scan"
                placeholder="请输入或扫描设备新MAC（必填）"
              />
            </template>
          </div>
        </template>
        <!-- 不装/不换 -->
        <template v-else>
          <div class="scanRegion">
            <van-field
              v-model="
                allEqu[allEquPopIndex].equipmentList[equPopIndex].equipmentDesc
              "
              placeholder="请输入原因(必填)"
            />
          </div>
        </template>

        <div class="buttonRegion">
          <van-button type="info" @click="cancelEquPop">取消</van-button>
          <van-button type="info" @click="confirmEquPop">确认</van-button>
        </div>
      </van-popup>
      <!-- wifi速率标准弹出层 -->
      <van-popup class="wifiRateNormPop" v-model="wifiRateNormPopShow">
        <table>
          <tr>
            <th rowspan="2">宽带速率</th>
            <th colspan="3">家庭WIFI服务近场WIFI速率标准</th>
          </tr>
          <tr>
            <th>黄金级</th>
            <th>白金级</th>
            <th>钻石级</th>
          </tr>
          <tr>
            <td>1000M</td>
            <td>≥350Mbps</td>
            <td>≥700Mbps</td>
            <td>≥800Mbps</td>
          </tr>
          <tr>
            <td>500/600M</td>
            <td>≥350Mbps</td>
            <td>≥签约速率80%</td>
            <td>≥签约速率80%</td>
          </tr>
          <tr>
            <td>＜500M</td>
            <td>≥签约速率80%</td>
            <td>≥签约速率80%</td>
            <td>≥签约速率80%</td>
          </tr>
        </table>
        <p>
          注：近场WIFI速率是指：使用联通测试终端及测试软件检测的速率，家庭WIFI服务路由器使用超五类及以上网线连接光猫，路由器周围1米无遮挡，在距离路由器1米内进行测试，并且断开路由器其他终端连接。
        </p>
      </van-popup>
      <!-- 用户FTTR主从设备信息弹出层 -->
      <van-popup v-model="deviceFttrPopShow" class="deviceFttrPop">
        <div class="title">用户FTTR主从设备信息</div>
        <table>
          <tr>
            <td>FTTR主从设备</td>
            <td>连接方式</td>
            <td>光功率</td>
          </tr>
          <tr v-for="(item, index) in deviceFttrList" :key="index">
            <td>
              <p>{{ item.parentApMac }}</p>
              <p>{{ item.mac }}</p>
            </td>
            <td>{{ item.connectInterface }}</td>
            <td>{{ item.receivingPower }}dbm</td>
          </tr>
        </table>
        <div class="button">
          <van-button type="info" @click="deviceFttrPopShow = false"
            >关闭</van-button
          >
        </div>
      </van-popup>
    </div>
  </div>
</template>


<script>
import { getItem, removeItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

import {
  reqIomNewFinishQuery,
  reqIomNewSpeedForm,
  reqIomNewLanInQuire,
  reqIomNewWifiVm,
  reqIomNewQueryFTTRInfo,
} from "@/http/button";

export default {
  name: "IomNewReply",
  mixins: [keepAliveMixin],
  data() {
    return {
      id: -1, // 工单唯一标识
      orderNum: "", // 受理单号
      mainMarginTop: "margin-top:0px", // main盒子margin-top值
      materialsInfo: "", // 选择的外包材料内容-展示
      guDingIPisWork: "", // 固定IP是否施工 1施工 0不施工
      guDingIPisWorkDesc: "", // 固定IP不施工说明
      isyueling: "", // 固话悦铃是否施工 0施工 1不施工
      yuelingdesc: "", // 固话悦铃不施工原因
      isWifiNetGateBuild: "", // 沃家组网-宽带接入网关升级服务是否施工 0：施工 ，1：未施工
      iptvUnworkedFlag: "0", // IPTV不竣工标识 为空：默认施工，1：未施工 ，0：施工
      iptvUnworkedBackReason: "", // IPTV不施工选择退单原因
      iptvUnworkedBackReasonShow: false,
      iptvUnworkedBackReasonActions: [
        { name: "局方资源不可达" },
        { name: "客户要求退单" },
        { name: "客户(业主)不同意打孔/明线" },
      ],
      iptvList: [], // iptv设备信息
      ottList: [], // ott设备
      pjzList: [], // 皮基站设备
      wjcpList: [], // 沃由器
      wifiList: [], // wifi产品设备
      // equipmentList: [], // 看家服务-室内摄像头设备,室外枪机，智能门铃
      allEqu: [], // 看家服务-室内摄像头设备
      isFttrBuild: "", // FTTR是否施工 1：施工 ，0：未施工
      fttrBuildWiring: "", // 施工布线
      fttrBuildWiringShow: false,
      fttrBuildWiringActions: [
        { name: "隐形光纤" },
        { name: "明线光纤" },
        { name: "暗线光纤" },
        { name: "网线" },
      ],
      isQueryDevice: false, // 是否点击过“查询主从设备”按钮
      // 用户FTTR从设备信息
      deviceFttrPopShow: false,
      deviceFttrList: [],

      isShenYanBuild: "", // 神眼是否施工为空：默认施工，0：施工 ，1：未施工(备注：不是神眼业务传空)
      shenYanDesc: "", // 神眼不施工描述(备注：不是神眼业务传空)
      remark: "", // 回单备注
      areaCodeName: "", // 行政区县编码
      areaCode: "",
      areaCodeShow: false,
      areaCodeActions: [
        { name: "东城区", value: "110101" },
        { name: "西城区", value: "110102" },
        { name: "朝阳区", value: "110105" },
        { name: "丰台区", value: "110106" },
        { name: "石景山区", value: "110107" },
        { name: "海淀区", value: "110108" },
        { name: "门头沟区", value: "110109" },
        { name: "房山区", value: "110111" },
        { name: "通州区", value: "110112" },
        { name: "顺义区", value: "110113" },
        { name: "昌平区", value: "110114" },
        { name: "大兴区", value: "110115" },
        { name: "怀柔区", value: "110116" },
        { name: "平谷区", value: "110117" },
        { name: "密云县", value: "110228" },
        { name: "延庆县", value: "110229" },
      ],

      // iptv设备信息弹出层
      iptvPopShow: false,
      iptvPopIndex: -1, // 当前弹出的iptv设备索引
      // 皮基站设备信息弹出层
      pjzPopShow: false,
      pjzPopIndex: -1,
      // ott设备信息弹出层
      ottPopShow: false,
      ottPopIndex: -1,
      // fttr从设备信息弹出层
      fttrPopShow: false,
      fttrPopIndex: -1,
      // 沃由器设备信息弹出层
      wjcpPopShow: false,
      wjcpPopIndex: -1,
      // wifi设备信息弹出层
      wifiPopShow: false,
      wifiPopIndex: -1,
      // 看家服务弹出层
      equPopShow: false,
      allEquPopIndex: -1, // allEqu第一层索引
      equPopIndex: -1, // allEqu内equipment索引

      // 测速平台-强制回单原因
      iom_TestRate_ReasonID: "",
      iom_TestRate_ReasonInfo: "", // IOM强制回单原因说明
      iomTestRateExplain: "", // 选择其他时输入的原因
      iom_TestRateShow: false,
      iom_TestRateActions: [
        { name: "用户家不具备测速条件，未进行测速", value: "1" },
        { name: "速率未达标，经与用户协商，用户同意报竣", value: "2" },
        { name: "用户称不需要测速，同意报竣", value: "3" },
        { name: "用户为倒装机已提前完成测速并达标，同意报竣", value: "4" },
        { name: "其他", value: "5" },
      ],
      // ONU收光率
      reasonTestLos: "",
      iom_TestRate_LosID: -1,
      iom_TestRate_LosInfo: "",
      iom_TestRate_LosShow: false,
      iom_TestRate_LosActions: [
        { name: "故障修复，用户不同意继续进行弱光整治", value: 9 },
        { name: "终端不支持光功率测量", value: 10 },
      ],

      // 光猫WIFI测速
      wifiBackResonId: -1,
      wifiBackResonInfo: "",
      wifiBackShow: false,
      wifiBackActions: [
        { name: "接入方式/模式不符合测速环境/用户要求桥接", value: 1 },
        { name: "测速系统故障", value: 2 },
      ],

      // LAN口协商速率
      lanRateReasonInfo: "",
      lanRateDesc: "", // 协商速率不达标强制回单说明
      lanRateReasonShow: false,
      lanRateReasonActions: [{ name: "其他原因" }],

      // wifi产品设备
      // wifi能力
      ability: "", // 0：没有路由器  1：有路由器无法判断 4：最高支持wifi4 5：最高支持wifi5 6：最高支持wifi6
      wifiAbilityName: "",
      wifiAbilityShow: false,
      wifiAbilityActions: [
        { name: "没有路由器", value: "0" },
        { name: "有路由器无法判断", value: "1" },
        { name: "最高支持wifi4", value: "4" },
        { name: "最高支持wifi5", value: "5" },
        { name: "最高支持wifi6", value: "6" },
      ],
      resModelName: "", // 终端型号 ability为1,4,5,6时，显示终端型号

      // 组网wifi设备测速
      wifiZwBackResonInfo: "",
      wifiZwBackResonId: "",
      wifiZwBackExplain: "", // 输入框内容
      wifiZwBackShow: false,
      wifiZwBackActions: [{ name: "其他原因", value: "1" }],
      hideWifiZWRegion: true, // 是否显示wifi组网设备测速-wifi产品设备点击不施工时隐形
      // wifi速率标准弹出层
      wifiRateNormPopShow: false,

      // 存储弹出框层临时设备信息-用作取消弹出层时复原
      tempDevInfo: {},
      // 回单前查询部分参数
      IomNewFinishQuery: {},
      // 列表详情部分参数
      listDetail: {},

      // 提交的信息
      postData: {
        fttrInfo: [],
        iptvInfoList: [],
        pjzList: [],
        ottList: [],
      },

      posCodeForceFinish: 0, // 0：正常回单，1：POS设备无二维码强制回单
    };
  },
  computed: {
    // 顶部标头
    headName() {
      return `回复(${this.orderNum})`;
    },
    materialsValue() {
      // 外包材料是否有值-表单验证
      if (this.materialsInfo) {
        // 外包材料有值
        return "请编辑外包材料";
      } else {
        return "";
      }
    },
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
      this.$store.commit("removeThisPage", this.$options.name);
    },
    // 刷新页面
    refreshFn() {
      // 回复前查询
      this.getIomNewFinishQuery();
    },
    // 选中固定IP是否施工
    clickGuDingIPisWork(bool) {
      if (bool) this.guDingIPisWork = "1";
      else this.guDingIPisWork = "0";
    },

    // 选中固话悦铃是否施工
    clickIsyueling(bool) {
      if (bool) this.isyueling = "0";
      else this.isyueling = "1";
    },

    // 选中沃家组网光猫升级是否施工
    clickIsWifiNetGateBuild(bool) {
      if (bool) this.isWifiNetGateBuild = "0";
      else this.isWifiNetGateBuild = "1";
    },

    // 选中IPTV设备是否施工
    clickIptvUnworkedFlag(bool) {
      if (bool) this.iptvUnworkedFlag = "0";
      else this.iptvUnworkedFlag = "1";
    },
    // 选中iptv不施工原因
    selectIptvUnworkedBackReason(action) {
      this.iptvUnworkedBackReason = action.name;
    },
    // 点击iptv设备出现弹出层
    clickIptvItem(index) {
      this.iptvPopShow = true;
      this.iptvPopIndex = index;
      this.tempDevInfo = JSON.parse(
        JSON.stringify(this.postData.iptvInfoList[index])
      );
    },
    // 选中iptv设备信息-是否电视芯
    clickIsTelevisionCore(bool) {
      if (bool) {
        this.$set(
          this.postData.iptvInfoList[this.iptvPopIndex],
          "isTelevisionCore",
          "1"
        );
      } else {
        this.$set(
          this.postData.iptvInfoList[this.iptvPopIndex],
          "isTelevisionCore",
          "0"
        );
      }
    },
    // 选中iptv设备信息-设备好坏
    clickIptvInfoListIsBreak(bool) {
      if (bool) {
        this.$set(this.postData.iptvInfoList[this.iptvPopIndex], "isBreak", 1);
      } else {
        this.$set(this.postData.iptvInfoList[this.iptvPopIndex], "isBreak", 2);
      }
    },
    // 确认iptv设备信息弹出层
    confirmIptvPop() {
      let iptvItem = this.postData.iptvInfoList[this.iptvPopIndex];

      if (iptvItem.isTelevisionCore === "1") {
        // 选择的终端设备
        if (iptvItem.iptvStbid == "" && iptvItem.iptvMac == "") {
          return this.$toast("机顶盒ID或MAC不能同时为空");
        }
        // 清除电视芯串码
        iptvItem.televisionCore = "";
        this.iptvList[this.iptvPopIndex].televisionCore = "";
        // 将值渲染在页面上
        this.iptvList[this.iptvPopIndex].iptvBoxId = iptvItem.iptvStbid;
        this.iptvList[this.iptvPopIndex].iptvMac = iptvItem.iptvMac;
      } else {
        // 选择的电视芯
        if (iptvItem.televisionCore == "") {
          return this.$toast("电视芯串码不能为空");
        }
        // 将值渲染在页面上
        this.iptvList[this.iptvPopIndex].televisionCore =
          iptvItem.televisionCore;
      }
      this.iptvPopShow = false;
    },
    // 取消iptv设备信息弹出层
    cancelIptvPop() {
      this.iptvPopShow = false;
      this.$set(
        this.postData.iptvInfoList,
        this.iptvPopIndex,
        this.tempDevInfo
      );
    },

    // 点击皮基站设备出现弹出层
    clickPjzItem(index) {
      this.pjzPopShow = true;
      this.pjzPopIndex = index;
      this.tempDevInfo = JSON.parse(
        JSON.stringify(this.postData.pjzList[index])
      );
    },
    // 确认皮基站设备信息弹出层
    confirmPjzPop() {
      let pjzItem = this.postData.pjzList[this.pjzPopIndex];
      if (pjzItem.sn == "" || pjzItem.mac == "") {
        return this.$toast("SN、MAC不能为空");
      }
      // 渲染到页面
      this.pjzList[this.pjzPopIndex].sn = pjzItem.sn;
      this.pjzList[this.pjzPopIndex].mac = pjzItem.mac;
      // 关闭弹出层
      this.pjzPopShow = false;
    },
    // 取消皮基站设备信息弹出层
    cancelPjzPop() {
      this.pjzPopShow = false;
      this.$set(this.postData.pjzList, this.pjzPopIndex, this.tempDevInfo);
    },

    // 点击ott设备出现弹出层
    clickOttItem(index) {
      this.ottPopShow = true;
      this.ottPopIndex = index;
      this.tempDevInfo = JSON.parse(
        JSON.stringify(this.postData.ottList[index])
      );
    },
    // 确认ott设备信息弹出层
    confirmOttPop() {
      let ottItem = this.postData.ottList[this.ottPopIndex];
      if (ottItem.sn == "" && ottItem.mac == "") {
        return this.$toast("SN和MAC至少有一项不能为空");
      }
      // 渲染到页面
      this.ottList[this.ottPopIndex].sn = ottItem.sn;
      this.ottList[this.ottPopIndex].mac = ottItem.mac;
      // 关闭弹出层
      this.ottPopShow = false;
    },
    // 取消ott设备信息弹出层
    cancelOttPop() {
      this.ottPopShow = false;
      this.$set(this.postData.ottList, this.ottPopIndex, this.tempDevInfo);
    },

    // 选中沃由器设备出现弹出层
    clickWjcpItem(index) {
      this.wjcpPopShow = true;
      this.wjcpPopIndex = index;
      this.tempDevInfo = JSON.parse(JSON.stringify(this.wjcpList[index]));
    },
    // 选中沃由器弹出层-设备好坏
    clickWjcpListIsBreak(bool) {
      if (bool) {
        // 好
        this.wjcpList[this.wjcpPopIndex].isBreak = 1;
      } else {
        this.wjcpList[this.wjcpPopIndex].isBreak = 2;
      }
    },
    // 确认沃油器设备信息弹出层
    confirmWjcpPop() {
      let wjcpItem = this.wjcpList[this.wjcpPopIndex];
      if (wjcpItem.sn == "" && wjcpItem.mac == "") {
        return this.$toast("SN和MAC至少有一项不能为空");
      }
      this.wjcpPopShow = false;
    },
    // 取消沃油器设备信息弹出层
    cancelWjcpPop() {
      this.wjcpPopShow = false;
      this.$set(this.wjcpList, this.wjcpPopIndex, this.tempDevInfo);
    },
    // 选择wifi能力
    selectWifiAbility(action) {
      this.wifiAbilityName = action.name;
      this.ability = action.value;
    },
    // 选中wifi设备出现弹出层
    clickWifiItem(index) {
      this.wifiPopShow = true;
      this.wifiPopIndex = index;
      // 将弹出层信息存放在临时列表里
      this.tempDevInfo = JSON.parse(JSON.stringify(this.wifiList[index]));
    },
    // 选中wifi设备弹出层-设备好坏
    clickWifiListIsBreak(bool) {
      if (bool) {
        // 好
        this.wifiList[this.wifiPopIndex].isBreak = 1;
      } else {
        this.wifiList[this.wifiPopIndex].isBreak = 2;
      }
    },
    // 选中wifi设备弹出层-是否施工
    clickWifiListIsWifiBuild(bool) {
      if (bool) {
        // 施工
        this.wifiList[this.wifiPopIndex].isWifiBuild = "0";
      } else {
        // 不施工
        this.wifiList[this.wifiPopIndex].isWifiBuild = "1";
      }
    },
    // 确认wifi设备信息弹出层
    confirmWifiPop() {
      let wifiItem = this.wifiList[this.wifiPopIndex];
      if (wifiItem.isWifiBuild === "0") {
        // 选择施工
        if (wifiItem.sn == "" && wifiItem.mac == "") {
          return this.$toast("新机顶盒ID或新MAC不能同时为空");
        }
        // 将其他设备设为施工状态
        this.wifiList.forEach((item, index) => {
          this.$set(this.wifiList[index], "isWifiBuild", "0");
        });
        // 显示组网wifi设备测速内容
        this.hideWifiZWRegion = true;
      } else {
        // 不施工
        if (wifiItem.wifiDescribe == "") {
          return this.$toast("不施工原因不能为空");
        }
        this.wifiList.forEach((item, index) => {
          // 将其他设备设为不施工状态
          this.$set(this.wifiList[index], "isWifiBuild", "1");
          // 将施工item的sn、mac清空
          this.$set(this.wifiList[index], "sn", "");
          this.$set(this.wifiList[index], "mac", "");
          // 同步设置其他设备不施工原因
          this.$set(
            this.wifiList[index],
            "wifiDescribe",
            wifiItem.wifiDescribe
          );
        });
        // 隐藏组网wifi设备测速内容
        this.hideWifiZWRegion = false;
      }
      this.wifiPopShow = false;
    },
    // 取消wifi设备信息弹出层
    cancelWifiPop() {
      this.wifiPopShow = false;
      // 若取消弹出层，所做的改动不应用
      this.$set(this.wifiList, this.wifiPopIndex, this.tempDevInfo);
    },
    // fttr-查询主从设备
    async queryDevice() {
      // 记录用户已点开
      this.isQueryDevice = true;
      // 传参
      let id = this.id;
      let addressList = []; // [String mac] //MAC地址,这个地址为每一个FTTR设备的mac地址
      this.postData.fttrInfo.forEach((item) => {
        let obj = {};
        obj.mac = item.mac;
        addressList.push(obj);
      });
      let result = await reqIomNewQueryFTTRInfo(
        JSON.stringify({ id, addressList })
      );
      this.apiResponse(result, ".reply", () => {
        // 展示用户FTTR主从设备信息
        this.deviceFttrList = result.fttrList;
        this.deviceFttrPopShow = true;
      });
    },
    // 选中fttr设备出现弹出层
    clickFttrItem(index) {
      this.fttrPopShow = true;
      this.fttrPopIndex = index;
      this.tempDevInfo = JSON.parse(
        JSON.stringify(this.postData.fttrInfo[index])
      );
    },
    // 确认fttr设备信息弹出层
    confirmFttrPop() {
      let fttrItem = this.postData.fttrInfo[this.fttrPopIndex];
      // 装机
      if (fttrItem.actType === "A") {
        if (fttrItem.hasOwnProperty("sn") && fttrItem.hasOwnProperty("mac")) {
          if (fttrItem.sn == "" || fttrItem.mac == "") {
            return this.$toast("SN、MAC不能为空");
          }
        } else {
          return this.$toast("SN、MAC不能为空");
        }
      } else {
        // 换机
        if (
          fttrItem.hasOwnProperty("sn") &&
          fttrItem.hasOwnProperty("mac") &&
          fttrItem.hasOwnProperty("oldSn") &&
          fttrItem.hasOwnProperty("oldMac")
        ) {
          if (
            fttrItem.sn == "" ||
            fttrItem.mac == "" ||
            fttrItem.oldSn == "" ||
            fttrItem.oldMac == ""
          ) {
            return this.$toast("新SN、新MAC、旧SN、旧MAC不能为空");
          }
        } else {
          return this.$toast("新SN、新MAC、旧SN、旧MAC不能为空");
        }
      }
      // 关闭弹出层
      this.fttrPopShow = false;
      // 如果先选择了“不装“或”不换“，再填写SN和MAC点击确定时，提示信息
      if (fttrItem.isFttrBuild === "0") {
        this.$toast(
          "您已选择不装该设备，但您填写了设备信息，系统已将该设备设置为安装，如需不安装，可手工将其设置为不装"
        );
      }
      // 自动选中装按钮
      this.$set(this.postData.fttrInfo[this.fttrPopIndex], "isFttrBuild", "1");
    },
    // 取消fttr设备信息弹出层
    cancelFttrPop() {
      this.fttrPopShow = false;
      this.$set(this.postData.fttrInfo, this.fttrPopIndex, this.tempDevInfo);
    },
    // 选中FTTR从设备是否施工
    clickIsFttrBuild(bool) {
      if (bool) this.isFttrBuild = "1";
      else this.isFttrBuild = "0";
    },

    // 选中fttr从设备中item是否装换
    clickFttrInfoIsFttrBuild(bool, index) {
      if (bool) {
        // 不装
        this.$set(this.postData.fttrInfo[index], "isFttrBuild", "0");
        // 装机清空sn mac
        this.$set(this.postData.fttrInfo[index], "sn", "");
        this.$set(this.postData.fttrInfo[index], "mac", "");
        // 换机清空新旧sn mac
        if (this.postData.fttrInfo[index].actType === "X") {
          this.$set(this.postData.fttrInfo[index], "oldSn", "");
          this.$set(this.postData.fttrInfo[index], "oldMac", "");
        }
      } else {
        this.$set(this.postData.fttrInfo[index], "isFttrBuild", "1");
      }
    },
    // 选中fttr施工布线
    selectFttrBuildWiring(action) {
      this.fttrBuildWiring = action.name;
    },

    // 选中神眼是否施工
    clickIsShenYanBuild(bool) {
      if (bool) this.isShenYanBuild = "0";
      else this.isShenYanBuild = "1";
    },
    // 选中看家服务-室内摄像头item是否施工
    clickEquipmentListIsBuild(bool, equIndex, index) {
      if (bool) {
        // 装
        this.allEqu[equIndex].equipmentList[index].isBuild = "1";
        // 清空不装原因
        this.allEqu[equIndex].equipmentList[index].equipmentDesc = "";
      } else {
        this.allEqu[equIndex].equipmentList[index].isBuild = "0";
        // 清空装sn，mac
        this.allEqu[equIndex].equipmentList[index].sn = "";
        this.allEqu[equIndex].equipmentList[index].mac = "";
      }
    },
    // 选中看家服务出现弹出层
    clickEquItem(equIndex, index) {
      // 先要选择是否新装
      if (this.allEqu[equIndex].equipmentList[index].isBuild == "") {
        // 提示
        if (this.allEqu[equIndex].equipmentList[index].actType === "A") {
          // 装
          return this.$toast("请选择是否新装");
        } else {
          // 换
          return this.$toast("请选择是否更换");
        }
      }
      this.equPopShow = true;
      this.allEquPopIndex = equIndex;
      this.equPopIndex = index;
      this.tempDevInfo = JSON.parse(
        JSON.stringify(this.allEqu[equIndex].equipmentList[index])
      );
    },
    // 确认看家服务信息弹出层
    confirmEquPop() {
      let equItem =
        this.allEqu[this.allEquPopIndex].equipmentList[this.equPopIndex];
      // 判断是装还是不装
      if (equItem.isBuild == "1") {
        // 装
        if (equItem.sn == "" || equItem.mac == "") {
          return this.$toast("SN、MAC不能为空");
        }
      } else {
        // 不装
        if (equItem.equipmentDesc == "") {
          return this.$toast("请输入原因");
        }
      }
      // 关闭弹出层
      this.equPopShow = false;
    },
    // 取消看家服务信息弹出层
    cancelEquPop() {
      this.equPopShow = false;
      this.$set(
        this.allEqu[this.allEquPopIndex].equipmentList,
        this.equPopIndex,
        this.tempDevInfo
      );
    },

    // 选中行政区
    selectAreaCode(action) {
      this.areaCodeName = action.name;
      this.areaCode = action.value;
    },

    // 选中测速平台强制回单原因
    selectIomTestRate(action) {
      this.iom_TestRate_ReasonInfo = action.name;
      this.iom_TestRate_ReasonID = action.value;
    },
    // 选中onu收光率强制回单原因
    selectIomTestRateLos(action) {
      this.iom_TestRate_LosID = action.value;
      this.iom_TestRate_LosInfo = action.name;
    },
    // 选中光猫wifi测速强制回单原因
    selectWifiBack(action) {
      this.wifiBackResonId = action.value;
      this.wifiBackResonInfo = action.name;
    },

    // 选中 LAN口协商速率 强制回单原因
    selectLanRateReason(action) {
      this.lanRateReasonInfo = action.name;
    },
    // 选中组网WIFI设备测速强制回单原因
    selectWifiZwBack(action) {
      this.wifiZwBackResonId = action.value;
      this.wifiZwBackResonInfo = action.name;
    },

    // 编辑外包材料
    editMaterials() {
      console.log("编辑外包材料");

      this.$router.push({
        name: "Materials",
        query: {
          orderNum: this.orderNum,
        },
      });
    },
    // 获取外包材料-显示页面
    getMaterialInfo() {
      if (getItem("saveMaterialInfo")) {
        let MaterialInfo = getItem("saveMaterialInfo");
        let MaterialValues = Object.values(MaterialInfo);
        let MaterialNames = [
          "二芯室内线:米",
          "铁芯电话线(黑皮):米",
          "网线-五类线:米",
          "室内光皮线:米",
          "室外光皮线:米",
          "光纤尾纤:套",
          "冷接插头:个",
          "热熔插头:个",
          "水晶头:个",
          "光跳线:条",
        ];
        let str = "";
        MaterialValues.forEach((value, index) => {
          if (value !== "") {
            let name = MaterialNames[index].split(":")[0];
            let va = value;
            let unit = MaterialNames[index].split(":")[1];
            str += `[${name}:${va}${unit}]`;
          }
        });
        this.materialsInfo = str;
      }
    },
    // 置灰按钮提交提示
    putAsh() {
      if (this.IomNewFinishQuery.lanStatus == "1") {
        return this.$toast("LAN口协商速率未测速，禁止回单");
      }
      if (this.IomNewFinishQuery.lanStatus == "2") {
        return this.$toast("LAN口协商速率未收到测速结果，禁止回单");
      }
      if (this.IomNewFinishQuery.wifiZwStatus == "1") {
        return this.$toast("组网WIFI设备未测速，禁止回单");
      }
    },
    // 发起掌沃通测速
    async speedForm() {
      let result = await reqIomNewSpeedForm(
        JSON.stringify({ id: this.id, areaCode: this.areaCode })
      );
      console.log("发起掌沃通测速结果", result);
      if (result.operationSuccessFlag) {
        // 刷新页面
        this.refreshFn();
      } else {
        this.$dialog
          .alert({
            title: "发起测速失败",
            message: result.errorMessage,
            confirmButtonText: "关闭",
            getContainer: ".reply",
            className: "confirmDialog",
          })
          .then(() => {
            // on close
          });
      }
    },
    // LAN口协商速率测速
    async LanInQuire() {
      let result = await reqIomNewLanInQuire(JSON.stringify({ id: this.id }));
      console.log("LAN口协商速率测速结果", result);
      this.apiResponse(result, ".reply", () => {
        this.refreshFn();
      });
    },
    // WIFI组网测速
    async WifiVm() {
      let result = await reqIomNewWifiVm(JSON.stringify({ id: this.id }));
      console.log("WIFI组网测速结果", result);
      this.apiResponse(result, ".reply", () => {
        this.refreshFn();
      });
    },
    // 判断是否可以确定回复跳转到签名页面
    judgeFinish() {
      // 需要传参的内容
      // #region
      let id = this.id;
      let materIialInfo = getItem("saveMaterialInfo");
      // 测速平台强制回单原因
      let iom_TestRate_ReasonID = this.iom_TestRate_ReasonID;
      let iom_TestRate_ReasonInfo = this.iom_TestRate_ReasonInfo;
      // iptv设备
      let iptvUnworkedFlag = this.iptvUnworkedFlag;
      let iptvUnworkedBackReason = this.iptvUnworkedBackReason;
      let iptvInfoList = this.postData.iptvInfoList;
      // fttr设备
      let fttrInfo = this.postData.fttrInfo;
      let isFttrBuild = this.isFttrBuild;
      let fttrBuildWiring = this.fttrBuildWiring;
      // onu收光率
      let iom_TestRate_LosID = this.iom_TestRate_LosID;
      let iom_TestRate_LosInfo = this.iom_TestRate_LosInfo;
      let onuList = [];
      // wifi产品设备
      let wifiList = this.wifiList;
      let iomIsOpWifi = "1"; // 是否操作WIFI终端 0：是  1：否
      let notOpWifiDesc = ""; // WIFI终端不施工原因
      let resModelName = this.resModelName;
      let ability = this.ability;
      // ott设备
      let ottList = this.postData.ottList;
      // 皮基站
      let pjzList = this.postData.pjzList;
      // 沃家产品
      let wjcpList = this.wjcpList;
      let iomIsOpWoRouter = "1"; // 是否操作沃由器 0：是  1：否
      // 看家服务设备
      let equipmentList = [];
      // 光猫wifi测速
      let wifiBackResonId = this.wifiBackResonId;
      let wifiBackResonInfo = this.wifiBackResonInfo;
      // 神眼
      let isShenYanBuild = this.isShenYanBuild;
      let shenYanDesc = this.shenYanDesc;
      // 沃家组网光猫
      let isWifiNetGateBuild = this.isWifiNetGateBuild;
      // 固话悦铃
      let isyueling = this.isyueling;
      let yuelingdesc = this.yuelingdesc;
      // 固定ip
      let guDingIPisWork = this.guDingIPisWork;
      let guDingIPisWorkDesc = this.guDingIPisWorkDesc;
      // lan协商速率
      let lanRateReasonInfo = this.lanRateReasonInfo;
      let lanRateDesc = this.lanRateDesc;
      // wifi组网
      let wifiZwBackResonId = this.wifiZwBackResonId;
      let wifiZwBackResonInfo = this.wifiZwBackResonInfo;
      let remark = this.remark; // 回单备注
      let posCodeForceFinish = this.posCodeForceFinish;

      // #endregion

      // 验证或修改传参内容
      // #region
      // 判断外包材料
      if (this.materIialInfo == "") return this.$toast("请编辑外包材料");
      // 判断固定ip
      if (
        this.IomNewFinishQuery.guDingIPtoWork == "99" &&
        guDingIPisWork == ""
      ) {
        return this.$toast("请选择固定IP是否施工");
      }
      if (guDingIPisWork == "0" && guDingIPisWorkDesc == "") {
        return this.$toast("请输入固定IP不施工说明");
      }
      // 判断固话悦铃
      if (this.IomNewFinishQuery.isyueling == "99" && isyueling == "") {
        return this.$toast("请选择固话悦铃是否施工");
      }
      if (isyueling == "1" && yuelingdesc == "") {
        return this.$toast("请输入固话悦铃不施工说明");
      }
      // 判断iptv设备
      if (iptvInfoList.length > 0) {
        if (this.listDetail.isIptvAdd === "1") {
          // 选择施工
          if (iptvUnworkedFlag === "0") {
            // 若item sn和mac都为空或电视芯串码为空则无法提交
            for (let i = 0; i < iptvInfoList.length; i++) {
              if (iptvInfoList[i].isTelevisionCore == "0") {
                // 选择电视芯
                if (iptvInfoList[i].televisionCore === "")
                  return this.$toast("请填写iptv设备信息");
              } else {
                // 选择终端设备
                if (
                  iptvInfoList[i].iptvStbid === "" &&
                  iptvInfoList[i].iptvMac === ""
                ) {
                  return this.$toast("请填写iptv设备信息");
                }
              }
            }
          } else {
            // 选择不施工
            iptvInfoList = [];
            if (iptvUnworkedBackReason == "")
              return this.$toast("请选择IPTV不施工原因");
          }
        } else {
          // 无法选择是否施工按钮-必须施工
          // 若item sn和mac都为空或电视芯串码为空则无法提交
          iptvInfoList.forEach((item) => {
            if (
              (item.iptvStbid === "" && item.iptvMac === "") ||
              item.televisionCore === ""
            ) {
              return this.$toast("请填写iptv设备施工内容");
            }
          });
        }
      }

      // 判断皮基站设备
      // 判断皮基站是否填写施工内容
      for (let i = 0; i < pjzList.length; i++) {
        if (pjzList[i].sn === "") return this.$toast("请填写皮基站设备信息");
      }
      // 判断ott设备
      // 判断ott是否填写施工内容
      for (let i = 0; i < ottList.length; i++) {
        if (ottList[i].sn === "" && ottList[i].mac === "")
          return this.$toast("请填写ott设备信息");
      }

      // 判断沃家产品设备
      // 判断沃家产品是否填写施工内容
      for (let i = 0; i < wjcpList.length; i++) {
        if (wjcpList[i].sn === "" && wjcpList[i].mac === "")
          return this.$toast("请填写沃家产品设备信息");
        iomIsOpWoRouter = "0"; // 是否操作沃油器 0：是
      }

      // 判断wifi产品设备
      if (this.IomNewFinishQuery.isHaveWifiList === 1) {
        // 判断是否施工
        if (wifiList[0].isWifiBuild === "1") {
          // 不施工
          if (wifiList[0].wifiDescribe === "") {
            return this.$toast("请填写WIFI产品设备不施工原因");
          }
          notOpWifiDesc = wifiList[0].wifiDescribe; // 共用不施工原因
        } else {
          // 施工
          for (let i = 0; i < wifiList.length; i++) {
            if (wifiList[i].sn === "" && wifiList[i].mac === "")
              return this.$toast("请填写WIFI产品设备施工信息");
          }
          // 是否操作WIFI终端 0：是  1：否
          iomIsOpWifi = "0";
        }
      } else {
        if (ability === "") {
          return this.$toast("请选择wifi设备");
        }
        if (ability !== "" && ability !== "0") {
          if (resModelName === "") return this.$toast("请输入用户终端型号");
        }
      }
      // 判断fttr从设备
      if (fttrInfo.length > 0) {
        // fttr设备有内容
        if (this.listDetail.isFttrSelect === "1") {
          // fttr可选择是否施工
          // 提交时必须选择
          if (isFttrBuild === "") {
            return this.$toast("FTTR从设备选择是否施工");
          } else if (isFttrBuild === "0") {
            // 做了选择
            // 如果isFttrBuild选择不施工，即隐藏所有的FTTR从设备Item，向后台传送的对象内容为空即可。
            fttrInfo = [];
          } else if (isFttrBuild === "1") {
            if (!isQueryDevice)
              return this.$toast("请至少点击一次“查询主从设备”按钮");
            // 判断是否选择施工布线
            if (fttrBuildWiring == "") return this.$toast("请选择施工布线");
            for (let i = 0; i < fttrInfo.length; i++) {
              // 选择施工-需要判断各个item是否选择是否施工
              if (
                fttrInfo[i].isFttrBuild !== "0" &&
                fttrInfo[i].isFttrBuild !== "1"
              ) {
                // 未选择
                return this.$toast("请选择FTTR从设备是否装机（或换机）");
              } else {
                // 已选
                // 如果选择“装”或“换”，则必须对SN、MAC（旧设备SN和MAC）进行必填验证。
                if (fttrInfo[i].isFttrBuild === "1") {
                  // 确认选择的是“装”还是“换”
                  if (fttrInfo[i].actType === "A") {
                    // 如果选择“装”，则SN、MAC为必填
                    // 判断其中一个是否填写了，有一个填写就说明点开item填写了
                    if (
                      fttrInfo[i].sn.length === 0 ||
                      !fttrInfo[i].hasOwnProperty("sn")
                    ) {
                      // 只选中是否施工，未点开填值
                      return this.$toast(
                        "FTTR从设备选择装机，则SN、MAC不能为空"
                      );
                    }
                  } else if (fttrInfo[i].actType === "X") {
                    // 如果选择“换”，则旧SN、MAC与新SN、MAC为必填
                    if (
                      fttrInfo[i].sn.length === 0 ||
                      !fttrInfo[i].hasOwnProperty("sn")
                    ) {
                      // 只选中是否施工，未点开填值
                      return this.$toast(
                        "FTTR从设备选择换机，则新、旧设备SN、MAC不能为空"
                      );
                    }
                  }
                } else if (fttrInfo[i].isFttrBuild === "0") {
                  // “不装”或“不换” - 照原样传值就行
                }
              }
            }
            /*   fttrInfo.forEach(item => {
                // 选择施工-需要判断各个item是否选择是否施工
                if (item.isFttrBuild !== '0' && item.isFttrBuild !== '1') {
                  // 未选择
                  return this.$toast('请选择FTTR从设备是否装机（或换机）')
                } else {
                  // 已选
                  // 如果选择“装”或“换”，则必须对SN、MAC（旧设备SN和MAC）进行必填验证。
                  if (item.isFttrBuild === '1') {
                    // 确认选择的是“装”还是“换”
                    if (item.actType === 'A') {
                      // 如果选择“装”，则SN、MAC为必填
                      // 判断其中一个是否填写了，有一个填写就说明点开item填写了
                      if (item.sn.length === 0 || !(item.hasOwnProperty('sn'))) {
                        // 只选中是否施工，未点开填值
                        return this.$toast('FTTR从设备选择装机，则SN、MAC不能为空')
                      }
                    } else if (item.actType === 'X') {
                      // 如果选择“换”，则旧SN、MAC与新SN、MAC为必填
                      if (item.sn.length === 0 || !(item.hasOwnProperty('sn'))) {
                        // 只选中是否施工，未点开填值
                        return this.$toast('FTTR从设备选择换机，则新、旧设备SN、MAC不能为空')
                      }
                    }
                  } else if (item.isFttrBuild === '0') {
                    // “不装”或“不换” - 照原样传值就行
                  }
  
                }
              }) */
          }
        } else {
          // 无需选择是否施工，默认施工
          // 判断是否选择施工布线
          if (fttrBuildWiring == "") return this.$toast("请选择施工布线");

          for (let i = 0; i < fttrInfo.length; i++) {
            // 选择施工-需要判断各个item是否选择是否施工
            if (
              fttrInfo[i].isFttrBuild !== "0" &&
              fttrInfo[i].isFttrBuild !== "1"
            ) {
              // 未选择
              return this.$toast("请选择FTTR从设备是否装机（或换机）");
            } else {
              // 已选
              // 如果选择“装”或“换”，则必须对SN、MAC（旧设备SN和MAC）进行必填验证。
              if (fttrInfo[i].isFttrBuild === "1") {
                // 确认选择的是“装”还是“换”
                if (fttrInfo[i].actType === "A") {
                  // 如果选择“装”，则SN、MAC为必填
                  // 判断其中一个是否填写了，有一个填写就说明点开item填写了
                  if (
                    fttrInfo[i].sn.length === 0 ||
                    !fttrInfo[i].hasOwnProperty("sn")
                  ) {
                    // 只选中是否施工，未点开填值
                    return this.$toast("FTTR从设备选择装机，则SN、MAC不能为空");
                  }
                } else if (fttrInfo[i].actType === "X") {
                  // 如果选择“换”，则旧SN、MAC与新SN、MAC为必填
                  if (
                    fttrInfo[i].sn.length === 0 ||
                    !fttrInfo[i].hasOwnProperty("sn")
                  ) {
                    // 只选中是否施工，未点开填值
                    return this.$toast(
                      "FTTR从设备选择换机，则新、旧设备SN、MAC不能为空"
                    );
                  }
                }
              } else if (fttrInfo[i].isFttrBuild === "0") {
                // “不装”或“不换” - 照原样传值就行
              }
            }
          }
        }
      }
      // 判断看家服务设备
      if (this.allEqu.length > 0) {
        for (let i = 0; i < this.allEqu.length; i++) {
          let item = this.allEqu[i].equipmentList;
          for (let j = 0; j < item.length; j++) {
            // 验证设备区域内的各个Item是否选择了装或不装
            if (item[j].isBuild === "") {
              // 未选择
              return this.$toast(`请选择${this.allEqu[i].allName}设备是否施工`);
            } else if (item[j].isBuild === "0") {
              // 不装/不换
              if (item[j].equipmentDesc === "") {
                return this.$toast(`请选择${this.allEqu[i].allName}不施工原因`);
              }
            } else if (item[j].isBuild === "1") {
              // 装/换
              if (item[j].actType === "A" && item[j].sn.length === 0) {
                return this.$toast(
                  `${this.allEqu[i].allName}设备选择装机，则SN、MAC不能为空`
                );
              } else if (item[j].actType === "X" && item[j].sn.length === 0) {
                return this.$toast(
                  `${this.allEqu[i].allName}设备选择换机，则新、旧设备SN、MAC不能为空`
                );
              }
            }
          }
        }
        /* this.allEqu.forEach(equ => {
          equ.equipmentList.forEach(item => {
            // 验证设备区域内的各个Item是否选择了装或不装
            if (item.isBuild === '') {
              // 未选择
              return this.$toast(`请选择${equ.allName}设备是否施工`)
            } else if (item.isBuild === '0') {
              // 不装/不换
              if (item.equipmentDesc === '') {
                return this.$toast(`请选择${equ.allName}不施工原因`)
              }
            } else if (item.isBuild === '1') {
              // 装/换
              if (item.actType === 'A' && item.sn.length === 0) {
                return this.$toast(`${equ.allName}设备选择装机，则SN、MAC不能为空`)
              } else if (item.actType === 'X' && item.sn.length === 0) {
                return this.$toast(`${equ.allName}设备选择换机，则新、旧设备SN、MAC不能为空`)

              }
            }
          })
        }) */
      }
      // 判断测速平台
      // 当测速平台强制回单原因选择其他时，iom_TestRate_ReasonInfo为输入框原因
      if (iom_TestRate_ReasonID === "5") {
        iom_TestRate_ReasonInfo = this.iomTestRateExplain;
      }
      if (this.IomNewFinishQuery.speedFlag === 2) {
        if (iom_TestRate_ReasonInfo === "") {
          if (iom_TestRate_ReasonID === "5") {
            return this.$toast("请输入测速平台强制回单说明");
          }
          return this.$toast("请选择测速平台强制回单原因");
        }
      }
      // 判断onu收光率
      if (this.IomNewFinishQuery.reasonLosFlag === 2) {
        if (iom_TestRate_LosInfo == "")
          return this.$toast("请选择ONU收光率强制回单原因");
      }
      // 判断光猫wifi测速
      if (wifiBackResonInfo == "")
        return this.$toast("请选择光猫WIFI测速强制回单原因");
      // 判断lan口协商速率
      if (
        this.IomNewFinishQuery.lanStatus == "3" ||
        this.IomNewFinishQuery.lanStatus == "5"
      ) {
        if (this.lanRateReasonInfo == "")
          return this.$toast("请选择LAN口协商速率强制回单原因");
        if (this.lanRateDesc == "")
          return this.$toast("请输入LAN口协商速率强制回单说明");
      }
      // 判断组网wifi设备测速
      // 当组网WIFI设备测速强制回单原因选中其他时,wifiZwBackResonInfo为输入框内容
      if (this.wifiBackResonId === "1") {
        wifiZwBackResonInfo = this.wifiZwBackExplain;
      }
      if (this.hideWifiZWRegion) {
        if (
          this.IomNewFinishQuery.wifiZwStatus == "2" ||
          this.IomNewFinishQuery.wifiZwStatus == "4"
        ) {
          if (this.wifiZwBackResonInfo == "")
            return this.$toast("请选择组网WIFI设备测速强制回单原因");
          if (this.wifiZwBackExplain == "")
            return this.$toast("请输入组网WIFI设备测速强制回单说明");
        }
      }

      // 将allEqu里的equipmentList提取出来放进equipmentList
      this.allEqu.forEach((equ) => {
        equ.equipmentList.forEach((item) => {
          equipmentList.push(item);
        });
      });
      // #endregion

      // 跳转到签名页面
      let postData = {
        id,
        iom_TestRate_ReasonID,
        iom_TestRate_ReasonInfo,
        iptvUnworkedFlag,
        iptvUnworkedBackReason,
        iom_TestRate_LosID,
        iom_TestRate_LosInfo,
        materIialInfo,
        iptvInfoList,
        onuList,
        wjcpList,
        wifiList,
        remark,
        iomIsOpWoRouter,
        iomIsOpWifi,
        notOpWifiDesc,
        wifiBackResonId,
        wifiBackResonInfo,
        isShenYanBuild,
        shenYanDesc,
        isWifiNetGateBuild,
        lanRateReasonInfo,
        lanRateDesc,
        fttrInfo,
        isFttrBuild,
        ability,
        ottList,
        pjzList,
        wifiZwBackResonId,
        wifiZwBackResonInfo,
        fttrBuildWiring,
        isyueling,
        yuelingdesc,
        posCodeForceFinish,
        equipmentList,
        guDingIPisWork,
        guDingIPisWorkDesc,
      };
      this.$router.push({
        name: "IomNewFinishSignature",
        // 将接口参数传到签名页面
        query: {
          orderNum: this.orderNum,
          id: this.id,
          postData,
        },
      });
    },

    // 刷新-回复前查询
    async getIomNewFinishQuery() {
      let id = this.id;
      let needRealName = "";
      let chargeFlag = -1;
      let result = await reqIomNewFinishQuery(
        JSON.stringify({ id, needRealName, chargeFlag })
      );
      console.log("回复前查询结果", result);
      this.useIomNewFinishQueryInfo(result);
    },
    // 从列表详情传过来的值
    getListDetailParams() {
      // 列表详情参数
      let listDetail = this.$store.state.home.listDetail;
      this.orderNum = listDetail.orderId; // 受理单号
      this.id = listDetail.id; // 工单唯一标识
      this.listDetail = {
        wifiNetGateStatus: listDetail.wifiNetGateStatus,
        isIptvAdd: listDetail.isIptvAdd,
        isFttrSelect: listDetail.isFttrSelect,
        isShenYanInstall: listDetail.isShenYanInstall,
        isSysKanBanStatus: listDetail.isSysKanBanStatus,
      };
    },
    // 从列表详情传过来的回单前查询参数
    getIomNewFinishQueryInfo() {
      // 获取列表传过来的列表参数 以及在列表页请求的回单前查询参数
      let result = JSON.parse(this.$route.query.params);
      console.log("详情传递的回单前查询参数", result);
      this.useIomNewFinishQueryInfo(result);
    },
    // 参数渲染页面
    useIomNewFinishQueryInfo(result) {
      // 获取列表详情参数
      this.getListDetailParams();
      // “isSysKanBanStatus”  0不同步看板（黑框提示） 1同步看板
      if (this.listDetail.isSysKanBanStatus === "0") {
        this.$dialog
          .alert({
            title: "提示",
            message: "请注意：此工单不要现场引导客户评价",
            confirmButtonText: "我知道了",
            getContainer: ".reply",
            className: "confirmDialog",
          })
          .then(() => {
            // on close
          });
      }
      this.apiResponse(result, ".reply", () => {
        // 查看是正常回单还是强制回单
        if (result.hasOwnProperty("posCodeForceFinish")) {
          // 有属性 说明强制回单
          this.posCodeForceFinish = result.posCodeForceFinish;
          // 调整main的margin-top
          this.mainMarginTop = "margin-top:40px";
        }

        // 设备列表
        this.ottList = result.ottList;
        this.iptvList = result.iptvList;
        this.pjzList = result.pjzList;
        this.wjcpList = result.wjcpList;
        this.wifiList = result.wifiList;
        this.allEqu = result.allEqu;

        this.IomNewFinishQuery = {
          // LAN口协商速率
          lan1: result.lan1,
          lan2: result.lan2,
          lan3: result.lan3,
          lan4: result.lan4,
          reasonTestLos: result.reasonTestLos, // onu收光率
          // 组网WIFI设备测速
          wifiZwStatus: result.wifiZwStatus, // 0：无需测速(无按钮 1：未测速(有按钮 2：测速中 3：测速达标 (完成) 4：测速未达标(完成)
          wifiZwModel: result.wifiZwModel, // Wifi组网级别 1.黄金 2.白金 3.白金 4.钻石
          wifiZwVal: result.wifiZwVal, // Wifi组网速率
          // reasonLosFlag:ONU收光率是否达标标识，1：达标（达标时OUN收光率部分不显示） 2：不达标
          reasonLosFlag: result.reasonLosFlag,
          // “ReasonTestLos”，收光功率，“reasonLosFlag”为“2”时显示
          reasonTestLos: result.reasonTestLos,
          // “speedFlag”,测速是否达标 1：达标(达标时测速平台部分不显示) 2：不达标
          speedFlag: result.speedFlag,
          // “isHaveWifiList”，wifilist是否有值  1:有值（显示设备信息），2：没有（选择WIFI能力下拉框）
          isHaveWifiList: result.isHaveWifiList,
          // -1 : 非lan口测速（LAN口协商速率区域不显示）,1 :是lan口，未测速,2 :是lan口，已测速，未返回结果,3 :是lan口，已测速，测速失败,4 :是lan口，已测速，测速成功,5 :异常
          lanStatus: result.lanStatus,
          isyueling: result.isyueling, // 固话悦铃是否施工 99：外线需要选择固话悦铃是否施工
          // “speedFormButtonFlag”，发起测速按钮显示标识   1-显示
          speedFormButtonFlag: result.speedFormButtonFlag,
          // -1，默认，无需绑码；0：需要绑码但未绑，1：需要绑码已绑
          posCodeSign: result.posCodeSign,
          isAreaCode: result.isAreaCode, // 是否需要行政区 1-需要
          guDingIPtoWork: result.guDingIPtoWork, // 固定IP是否需要施工  99：需要施工
        };

        // fttr设备内容
        this.postData.fttrInfo = result.fttrList;
        // iptv设备信息弹出层内容
        this.iptvList.forEach((item, index) => {
          let obj = {};
          obj.iptvProdId = item.iptvProdId || ""; // 产品ID
          obj.iptvStbid = item.iptvBoxId || ""; // SN码
          obj.iptvMac = item.iptvMac || ""; // MAC地址
          obj.deviceSeq = item.deviceSeq || ""; // 设备编码
          obj.isTelevisionCore = "1"; // 是否电视芯 0-是，1或空-否
          obj.televisionCore = ""; // 电视芯
          obj.isBreak = 1; // 设备好坏 1好，2坏
          this.$set(this.postData.iptvInfoList, index, obj);
        });
        // 皮基站设备信息弹出层内容
        this.pjzList.forEach((item, index) => {
          let obj = {};
          obj.mac = item.mac || "";
          obj.sn = item.sn || "";
          obj.prodId = item.prodId || "";
          obj.prodName = item.prodName || "";
          this.$set(this.postData.pjzList, index, obj);
        });
        // ott设备信息弹出层内容
        this.ottList.forEach((item, index) => {
          let obj = {};
          obj.mac = item.mac || "";
          obj.sn = item.sn || "";
          obj.prodId = item.prodId || "";
          this.$set(this.postData.ottList, index, obj);
        });
        // wifi设备添加弹出层需要内容
        this.wifiList.forEach((item, index) => {
          // wifi产品设备默认改为施工状态
          this.$set(this.wifiList[index], "isWifiBuild", "0");
          // 将回复前查询缺少的参数补上
          this.$set(this.wifiList[index], "isBreak", 1);
          this.$set(this.wifiList[index], "wifiDescribe", "");
        });
        // “wifiZwStatus”，0：无需测速，wifi速率标准弹出层不显示
        if (result.wifiZwStatus !== "0") {
          this.wifiRateNormPopShow = true;
        }
      });
    },
  },
  created() {
    console.log("reply创建");
    // 从列表详情传过来的回单前查询参数
    this.getIomNewFinishQueryInfo();
  },
  activated() {
    // 获取外包材料
    this.getMaterialInfo();
    console.log("reply激活");
  },
  deactivated() {
    console.log("reply失活");
  },
  beforeDestroy() {
    console.log("reply销毁");
    removeItem("saveMaterialInfo"); // 销毁
  },
};
</script>

<style scoped lang="less">
@import "@/assets/css/confirmDialog.less";
.reply {
  // width: 100%;
  height: 100%;
  background-color: #f8f7fc;
  .posCodeSign {
    z-index: 1;
    position: fixed;
    top: 46px;
    width: 100%;
    padding: 10px;
    color: red;
    background-color: rgb(248, 248, 140);
    font-size: 14px;
  }
  .van-popup {
    width: 90%;
    padding: 10px;
  }
  .main {
    width: 100%;
    height: 100%;
    // margin-top: 40px;
    background-color: #fff;
    .van-form {
      background-color: #f8f7fc;
      .materialsContent {
        padding: 10px;
        text-align: left;
        background-color: #fff;
        color: #969799;
      }
      .textRight {
        /deep/.van-cell__value.van-field__value {
          input {
            text-align: right;
          }
        }
      }
      .borderTop {
        border-top: 1px solid #e0e0e0;
      }
      .borderBottom {
        border-bottom: 1px solid #e0e0e0;
      }
      .inputRegion {
        /deep/.van-cell__title {
          span {
            display: inline-block;
            margin-top: 5px;
          }
        }
        /deep/.van-cell__value {
          input {
            padding: 5px;
            border: 1px solid #e0e0e0;
          }
        }
      }
      .selectButton {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 45px;
        padding: 0 10px 0 16px;
        background-color: #fff;
        .title {
          display: flex;
          align-items: center;
          color: #646566;
          font-size: 14px;
        }
        .button {
          .van-button {
            width: 90px;
            height: 35px;
            padding: 5px;
            font-size: 13px;
          }
        }
      }
      .deviceList {
        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
          background-color: #f4f9ff;
          .left {
            display: flex;
            align-items: center;
            .num {
              width: 30px;
              height: 30px;
              border-radius: 15px;
              line-height: 30px;
              background: #1989fa;
              color: #fff;
            }
            .content {
              display: flex;
              .title,
              .value {
                display: flex;
                flex-direction: column;
                text-align: left;
                span {
                  padding: 5px;
                }
              }
              .equReason {
                width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: inline-block;
              }
            }
          }
          .right {
            .selectButton {
              padding: 0;
              background-color: transparent;
              .van-button {
                width: 50px;
              }
            }
          }
        }
      }
      .wjcp {
        padding: 10px 16px;
        background-color: #f7f4fc;
        text-align: left;
      }
      .region {
        margin-top: 10px;
        background-color: #fff;
        .tips1,
        .tips2,
        p {
          padding: 10px;
          text-align: left;
        }
        .tips1 {
          color: red;
        }
        .tips2 {
          color: blue;
        }
        /deep/.van-overlay {
          opacity: 0.3;
        }
        h4 {
          padding: 10px 16px;
          text-align: left;
        }
        .forcedReceiptTips {
          background-color: #fceef3;
          color: red;
          font-size: 13px;
          padding: 10px;
        }
        .reasonTestLos {
          padding: 10px 16px;
          text-align: left;
        }
        .againSpeed {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          background-color: #fceef3;
          .van-button {
            border-radius: 10px;
          }
        }
        .LAN {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          tr {
            td {
              padding: 10px 0;
              border: 1px solid #e0e0e0;
            }
          }
        }
      }
      .wifiZW {
        .van-cell {
          .van-cell__title {
            text-align: left;
          }
        }
        .viewWifiNorm {
          padding: 10px;
          text-align: right;
          color: blue;
          text-decoration: underline;
        }
      }
    }
    .devPop {
      width: 90%;
      padding: 10px;
      h3 {
        margin-top: 10px;
        color: @theme-color;
      }
      .isTelevisionCoreButton {
        margin-top: 10px;
        .button {
          .van-button {
            width: 50%;
            height: 40px;
          }
        }
      }
      .scanRegion {
        .van-cell {
          padding: 10px 0;
          /deep/.van-cell__value.van-field__value {
            width: 200px;
            input {
              padding: 5px;
              font-size: 12px;
              border: 1px solid #e0e0e0;
            }
            .van-icon {
              font-size: 25px;
            }
          }
        }
      }
      .selectButton {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 45px;
        padding: 0 10px 0 16px;
        background-color: #fff;
        .title {
          display: flex;
          align-items: center;
          color: #646566;
          font-size: 14px;
        }
        .button {
          .van-button {
            width: 90px;
            height: 35px;
            padding: 5px;
            font-size: 13px;
          }
        }
      }
      .buttonRegion {
        display: flex;
        justify-content: space-around;
        margin: 10px 0;
        .van-button {
          width: 40%;
        }
      }
      .wifiTips {
        color: red;
        text-align: left;
        font-size: 14px;
        padding: 10px;
      }
    }
    .wifiRateNormPop {
      width: 90%;
      padding: 10px;
      table {
        border: 1px solid #e0e0e0;
        border-collapse: collapse;
        td,
        th {
          border: 1px solid #e0e0e0;
          padding: 5px;
        }
        th {
          background-color: #cd0134;
          color: #fff;
        }
      }
      p {
        text-align: left;
        margin-top: 10px;
      }
    }

    .deviceFttrPop {
      padding: 10px;
      border: 1px solid @theme-color;
      .title {
        padding: 10px;
        border: 1px solid @theme-color;
        font-weight: 600;
      }
      table {
        width: 100%;
        border: 1px solid @theme-color;
        border-collapse: collapse;
        td {
          padding: 5px;
          border: 1px solid @theme-color;
          font-size: 14px;
        }
      }
      .button {
        padding: 10px;
        border: 1px solid @theme-color;
        .van-button {
          height: 36px;
          width: 30%;
        }
      }
    }
  }
}
</style>